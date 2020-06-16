package com.mercure.spring.batch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

public class BatchProcessor implements ItemProcessor<String, String> {

    static Logger log = LoggerFactory.getLogger(BatchProcessor.class);

    @Override
    public String process(String s) throws Exception {
        log.info("Converting data...");
        return s.toUpperCase();
    }
}
