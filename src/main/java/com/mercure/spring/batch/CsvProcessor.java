package com.mercure.spring.batch;

import com.mercure.spring.entity.Cars;
import org.apache.commons.csv.CSVRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.ItemProcessor;

public class CsvProcessor implements ItemProcessor<Cars, Cars> {

    static Logger log = LoggerFactory.getLogger(CsvProcessor.class);

    @Override
    public Cars process(Cars strings) throws Exception {
        log.info("I had no choice");
        return strings;
//        Car,MPG,Cylinders,Displacement,Horsepower,Weight,Acceleration,Model,Origin
//        Cars car = new Cars();
//        try {
//            car.setName(strings.get(0));
//            car.setConsumption(Double.parseDouble(strings.get(1)));
//            car.setCylinders(Integer.parseInt(strings.get(2)));
//            car.setDisplacement(Double.parseDouble(strings.get(3)));
//            car.setHorsepower(Double.parseDouble(strings.get(4)));
//            car.setWeight(Double.parseDouble(strings.get(5)));
//            car.setAcceleration(Double.parseDouble(strings.get(6)));
//            car.setModel(strings.get(7));
//            car.setOrigin(strings.get(8));
//            log.info("Creating car {}", car.getName());
//            return car;
//        } catch (NumberFormatException e) {
//            log.info("Record {} is not in the correct format, it will be ignored", strings.getRecordNumber());
//            log.warn(e.getMessage());
//        }
//        return null;
    }
}
