package com.mercure.utils;

import liquibase.pro.packaged.B;
import org.bouncycastle.asn1.ASN1Encodable;
import org.bouncycastle.asn1.DERSequence;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509ExtensionUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import org.bouncycastle.pkcs.PKCS10CertificationRequestBuilder;
import org.bouncycastle.pkcs.jcajce.JcaPKCS10CertificationRequestBuilder;
import org.bouncycastle.util.encoders.Base64;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.math.BigInteger;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.Calendar;
import java.util.Date;

@Service
public class CertificateUtil {

    private static final String BC_PROVIDER = "BC";
    private static final String KEY_ALGORITHM = "RSA";
    private static final String SIGNATURE_ALGORITHM = "SHA256withRSA";

    private static final String CERTIFICATE_PATH= "assets/certificates/";

    public CertificateUtil(){

    }

    public void validateCertificate(String certificateDataURI) throws Exception {
        String dataURICertificate = certificateDataURI.split(",")[1];
        byte[] base64CertificateContent = Base64.decode(dataURICertificate);
        CertificateFactory certFactory = CertificateFactory.getInstance("X.509");

        InputStream in = new ByteArrayInputStream(base64CertificateContent);
        X509Certificate clientCertificate = (X509Certificate)certFactory.generateCertificate(in);

    }

    public void issueClientCert(String name) throws Exception{
        Security.addProvider(new BouncyCastleProvider());

        CertificateFactory factory = CertificateFactory.getInstance("X.509");
        InputStream certificateStream = new FileInputStream(CERTIFICATE_PATH+"root-cert.cer");
        Certificate certificate = factory.generateCertificate(certificateStream);
        X509Certificate rootCert =(X509Certificate) certificate;
        certificateStream.close();

        FileInputStream inKeyStream = new FileInputStream(CERTIFICATE_PATH+"root-private.pem");
        String key = Files.readString(Path.of(CERTIFICATE_PATH+"root-private.pem"));

        String privateKeyPem = key
                .replace("-----BEGIN RSA PRIVATE KEY-----\n", "")
                .replaceAll(System.lineSeparator(), "")
                .replace("\n-----END RSA PRIVATE KEY-----\n", "");

        byte[] encoded = Base64.decode(privateKeyPem);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
        PrivateKey privateKey = keyFactory.generatePrivate(keySpec);
        RSAPublicKeySpec rsaPublicKeySpec = new RSAPublicKeySpec(((RSAPrivateCrtKey)privateKey).getModulus(), ((RSAPrivateCrtKey)privateKey).getPublicExponent());
        PublicKey publicKey = keyFactory.generatePublic(rsaPublicKeySpec);
        KeyPair rootKeyPair = new KeyPair(publicKey, privateKey);

        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(KEY_ALGORITHM, BC_PROVIDER);
        keyPairGenerator.initialize(2048);
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1);
        Date startDate = calendar.getTime();

        calendar.add(Calendar.YEAR, 1);
        Date endDate = calendar.getTime();


        X500Name issuedCertSubject = new X500Name("CN="+name);
        BigInteger issuedCertSerialNum = new BigInteger(Long.toString(new SecureRandom().nextLong()));
        KeyPair issuedCertKeyPair = keyPairGenerator.generateKeyPair();

        PKCS10CertificationRequestBuilder p10Builder = new JcaPKCS10CertificationRequestBuilder(issuedCertSubject, issuedCertKeyPair.getPublic());
        JcaContentSignerBuilder csrBuilder = new JcaContentSignerBuilder(SIGNATURE_ALGORITHM).setProvider(BC_PROVIDER);

        // Sign the new KeyPair with the root cert Private Key
        ContentSigner csrContentSigner = csrBuilder.build(rootKeyPair.getPrivate());
        PKCS10CertificationRequest csr = p10Builder.build(csrContentSigner);

        // Use the Signed KeyPair and CSR to generate an issued Certificate
        // Here serial number is randomly generated. In general, CAs use
        // a sequence to generate Serial number and avoid collisions
        X500Name issuerName = new X500Name(rootCert.getIssuerX500Principal().getName());
        X509v3CertificateBuilder issuedCertBuilder = new X509v3CertificateBuilder(issuerName, issuedCertSerialNum, startDate, endDate, csr.getSubject(), csr.getSubjectPublicKeyInfo());

        JcaX509ExtensionUtils issuedCertExtUtils = new JcaX509ExtensionUtils();

        // Add Extensions
        // Use BasicConstraints to say that this Cert is not a CA
        issuedCertBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(false));

        // Add Issuer cert identifier as Extension
        issuedCertBuilder.addExtension(Extension.authorityKeyIdentifier, false, issuedCertExtUtils.createAuthorityKeyIdentifier(rootCert));
        issuedCertBuilder.addExtension(Extension.subjectKeyIdentifier, false, issuedCertExtUtils.createSubjectKeyIdentifier(csr.getSubjectPublicKeyInfo()));

        // Add intended key usage extension if needed
        issuedCertBuilder.addExtension(Extension.keyUsage, false, new KeyUsage(KeyUsage.keyEncipherment));

        // Add DNS name is cert is to used for SSL
        issuedCertBuilder.addExtension(Extension.subjectAlternativeName, false, new DERSequence(new ASN1Encodable[] {
                new GeneralName(GeneralName.dNSName, "etf.unibl.org"),
                new GeneralName(GeneralName.iPAddress, "127.0.0.1")
        }));

        X509CertificateHolder issuedCertHolder = issuedCertBuilder.build(csrContentSigner);
        X509Certificate issuedCert  = new JcaX509CertificateConverter().setProvider(BC_PROVIDER).getCertificate(issuedCertHolder);

        // Verify the issued cert signature against the root (issuer) cert
        issuedCert.verify(rootCert.getPublicKey(), BC_PROVIDER);

        writeCertToFileBase64Encoded(issuedCert, CERTIFICATE_PATH+"issued-cert-functional.cer");
    }

    private void writeCertToFileBase64Encoded(Certificate certificate, String fileName) throws Exception {
        FileOutputStream certificateOut = new FileOutputStream(fileName);
        certificateOut.write("-----BEGIN CERTIFICATE-----\n".getBytes());
        certificateOut.write(Base64.encode(certificate.getEncoded()));
        certificateOut.write("\n-----END CERTIFICATE-----".getBytes());
        certificateOut.close();
    }
}