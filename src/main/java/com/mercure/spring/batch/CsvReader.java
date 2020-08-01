package com.mercure.spring.batch;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;
import org.springframework.context.annotation.Bean;

import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.net.URL;
import java.nio.file.Paths;
import java.util.List;

public class CsvReader implements ItemReader<CSVRecord> {

    static Logger log = LoggerFactory.getLogger(CsvReader.class);

    private int i = 0;

    @Override
    public CSVRecord read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
        URL res = getClass().getClassLoader().getResource("cars.csv");
        File file = Paths.get(res.toURI()).toFile();
        Reader reader = new FileReader(file);
        log.info("Reading file ...");
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader());
        List<CSVRecord> list = csvParser.getRecords();
        if (i < list.size()) {
            return list.get(i++);
        } else {
            i = 0;
        }
        log.info("Process finished");
        return null;
    }
}
