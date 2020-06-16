package com.mercure.spring.configuration;

import com.mercure.spring.batch.*;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sun.text.resources.be.JavaTimeSupplementary_be;

import java.util.function.Function;

@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Autowired
    JobBuilderFactory jobBuilderFactory;

    @Autowired
    public StepBuilderFactory stepBuilderFactory;

    @Bean
    public Job processJob() {
        return jobBuilderFactory.get("processJob")
                .incrementer(new RunIdIncrementer()).listener(listener())
                .flow(orderStep1()).end().build();
    }

    @Bean
    public Job processCsv() {
        return jobBuilderFactory.get("processCsv")
                .incrementer(new RunIdIncrementer()).listener(listener())
                .flow(parseCsv()).end().build();
    }

    @Bean
    public Step orderStep1() {
        return stepBuilderFactory.get("orderStep1").<String, String> chunk(1)
                .reader(new BatchReader())
                .processor(new BatchProcessor())
                .writer(new BatchWriter())
                .build();
    }

    @Bean
    public Step parseCsv() {
        return stepBuilderFactory.get("parseCsv").chunk(1)
                .reader(new CsvReader())
                .processor(new CsvProcessor())
                .writer(new CsvDbWriter())
                .build();
    }

    @Bean
    public JobExecutionListener listener() {
        return new BatchCompletionListener();
    }
}
