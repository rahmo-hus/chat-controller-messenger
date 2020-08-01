package com.mercure.spring.batch;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;

public class BatchCSVCompletionListener extends JobExecutionListenerSupport {

    static Logger log = LoggerFactory.getLogger(BatchCSVCompletionListener.class);

    @Override
    public void afterJob(JobExecution jobExecution) {
        if (BatchStatus.COMPLETED.equals(jobExecution.getStatus())) {
            log.info("CSV RETRIEVING DATA COMPLETED !");
        }
        else {
           log.warn("Something went wrong during the process");
        }
    }
}
