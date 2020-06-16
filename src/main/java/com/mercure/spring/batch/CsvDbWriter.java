package com.mercure.spring.batch;

import org.springframework.batch.item.ItemWriter;

import java.util.List;

public class CsvDbWriter implements ItemWriter<String> {

    @Override
    public void write(List<? extends String> list) throws Exception {

    }
}
