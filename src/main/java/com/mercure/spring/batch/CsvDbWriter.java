package com.mercure.spring.batch;

import com.mercure.spring.entity.Cars;
import com.mercure.spring.repository.CarsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemWriter;

import java.util.List;
import java.util.Objects;

public class CsvDbWriter implements ItemWriter<Cars> {

    static Logger log = LoggerFactory.getLogger(CsvDbWriter.class);

    private CarsRepository carsRepository;

    public CsvDbWriter(CarsRepository carsRepository) {
        this.carsRepository = carsRepository;
    }

    @Override
    public void write(List<? extends Cars> list) throws Exception {
        list.stream().filter(Objects::nonNull).forEach(car -> {
            log.info("Saving {} to database",car.getName());
            carsRepository.save(car);
        });
    }
}
