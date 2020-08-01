package com.mercure.spring.batch;

import com.mercure.spring.entity.Cars;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.stereotype.Service;

@Service
public class CarsMapper  {

    public String mapStrToStr(String s) {
        return s.toUpperCase();
    }


    public Cars mapToEntity(Cars s) {
        Cars car = new Cars();
        car.setAcceleration(1.2);
        return car;
    }

    public Cars mapStringToEntity(String s) {
        Cars car = new Cars();
        car.setAcceleration(1.2);
        return car;
    }
}
