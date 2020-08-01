package com.mercure.spring.batch;

import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;

public class BatchCompletionListener extends JobExecutionListenerSupport {

    @Override
    public void afterJob(JobExecution jobExecution) {
        if (BatchStatus.COMPLETED.equals(jobExecution.getStatus())) {
            System.out.println("BATCH JOB COMPLETED SUCCESSFULLY");
        }
    }
}
