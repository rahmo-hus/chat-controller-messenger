package com.mercure.spring.batch;

import com.mercure.spring.entity.Cars;
import com.mercure.spring.repository.CarsRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;

public class CsvProcessor implements ItemProcessor<Cars, Cars> {

    @Autowired
    private CarsRepository carsRepository;

    @Override
    public Cars process(Cars cars) throws Exception {
        Cars car = mapToEntity(cars);
        return carsRepository.save(car);
    }


    private Cars mapToEntity(Cars s) {
        Cars car = new Cars();
        car.setAcceleration(1.2);
        return car;
    }
}
