package com.sentiment.backend.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sentiment.backend.entity.SentimentStat;

import java.util.List;

@Repository
public interface SentimentStatRepository extends JpaRepository<SentimentStat, Long> {
    List<SentimentStat> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
