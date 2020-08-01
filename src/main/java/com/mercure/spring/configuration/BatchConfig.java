package com.mercure.spring.configuration;

import com.mercure.spring.batch.*;
import com.mercure.spring.entity.Cars;
import com.mercure.spring.repository.CarsRepository;
import org.apache.commons.csv.CSVRecord;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecutionListener;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.ui.Model;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@EnableBatchProcessing
public class BatchConfig {

    @Autowired
    JobBuilderFactory jobBuilderFactory;

    @Autowired
    public StepBuilderFactory stepBuilderFactory;

    @Autowired
    public CarsRepository carsRepository;

    @Bean
    public Job trainingJob() {
        return jobBuilderFactory.get("trainingJob")
                .incrementer(new RunIdIncrementer()).listener(listener())
                .flow(orderStep1()).end().build();
    }

    @Bean
    public Job processCsv() throws URISyntaxException {
        return jobBuilderFactory.get("processCsv")
                .incrementer(new RunIdIncrementer()).listener(csvListener())
                .flow(parseCsv()).end().build();
    }

    @Bean
    public Step orderStep1() {
        return stepBuilderFactory.get("orderStep1")
                .<String, String>chunk(1)
                .reader(new BatchReader())
                .processor(new BatchProcessor())
                .writer(new BatchWriter())
                .build();
    }

    @Bean
    public Step parseCsv() throws URISyntaxException {
        return stepBuilderFactory.get("parseCsv")
                .<Cars, Cars>chunk(1)
                .reader(csvAnimeReader())
                .processor(csvProcessor())
                .writer(new CsvDbWriter(carsRepository))
                .build();
    }

    @Bean
    public CsvProcessor csvProcessor() {
        return new CsvProcessor();
    }

    @Bean
    public JobExecutionListener listener() {
        return new BatchCompletionListener();
    }


    @Bean
    public JobExecutionListener csvListener() {
        return new BatchCSVCompletionListener();
    }


    @Bean
    public FlatFileItemReader<Cars> csvAnimeReader() throws URISyntaxException {
        URL res = getClass().getClassLoader().getResource("cars.csv");
        File file = Paths.get(res.toURI()).toFile();
        FileSystemResource resource = new FileSystemResource(file);

        FlatFileItemReader<Cars> reader = new FlatFileItemReader<>();
        reader.setLinesToSkip(1);
        reader.setResource(resource);
        reader.setLineMapper(new DefaultLineMapper<Cars>() {
            {
                setLineTokenizer(new DelimitedLineTokenizer() {
                    {
                        setNames("name",
                                "consumption",
                                "cylinders",
                                "Displacement",
                                "Horsepower",
                                "Weight",
                                "Acceleration",
                                "Model",
                                "Origin");
                    }
                });
                setFieldSetMapper(new BeanWrapperFieldSetMapper<Cars>() {
                    {
                        setTargetType(Cars.class);
                    }
                });
            }
        });
        return reader;
    }
}
