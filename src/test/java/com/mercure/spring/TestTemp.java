package com.mercure.spring;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.junit.jupiter.api.Test;

import java.io.*;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class TestTemp {

    @Test
    public void testCsvParser() throws IOException, URISyntaxException {
        URL res = getClass().getClassLoader().getResource("cars.csv");
        File file = Paths.get(res.toURI()).toFile();
        String absolutePath = file.getAbsolutePath();
        Reader filee = new FileReader(file);
        CSVParser records = new CSVParser(filee, CSVFormat.newFormat(';'));
        List<CSVRecord> rec = CSVFormat.DEFAULT.withFirstRecordAsHeader().parse(filee).getRecords();
        for (CSVRecord strings : records) {
            System.out.println(strings.get(0) + strings.get(1));
        }
    }

    @Test
    public void testCSVParser() throws IOException, URISyntaxException {
        URL res = getClass().getClassLoader().getResource("cars.csv");
        File file = Paths.get(res.toURI()).toFile();
        Reader reader = new FileReader(file);
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT);
        for (CSVRecord csvRecord : csvParser) {
            // Accessing Values by Column Index

            String Car = csvRecord.get(0);
            String MPG = csvRecord.get(1);
            String country = csvRecord.get(2);
            String Displacement = csvRecord.get(3);
            String Horsepower = csvRecord.get(4);
            String Weight = csvRecord.get(5);
            String Acceleration = csvRecord.get(6);
            String Model = csvRecord.get(7);
            String Origin = csvRecord.get(8);
            System.out.println("Record No - " + csvRecord.getRecordNumber());
            System.out.println("---------------");
            System.out.println("Car : " + Car);
            System.out.println("MPG : " + MPG);
            System.out.println("country : " + country);
            System.out.println("Displacement : " + Displacement);
            System.out.println("Horsepower : " + Horsepower);
            System.out.println("Weight : " + Weight);
            System.out.println("Acceleration : " + Acceleration);
            System.out.println("Model : " + Model);
            System.out.println("Origin : " + Origin);
            System.out.println("---------------\n\n");
        }
    }

}
