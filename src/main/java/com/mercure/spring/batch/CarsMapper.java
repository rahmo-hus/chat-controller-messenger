package com.mercure.spring.batch;

import com.mercure.spring.entity.Cars;
import com.mercure.spring.repository.CarsRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;

public class CsvProcessor implements ItemProcessor<Cars, Cars> {

    @Override
    public Cars process(Cars cars) throws Exception {
       return mapToEntity(cars);
    }


    private Cars mapToEntity(Cars s) {
        Cars car = new Cars();
        car.setAcceleration(1.2);
        return car;
    }
}
