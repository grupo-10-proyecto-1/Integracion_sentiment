package com.sentiment.backend.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;

import com.sentiment.backend.dto.Prevision;

@Entity
@Table(name = "sentiment_stats")
public class SentimentStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prevision prevision;

    @Column(nullable = false)
    private Double probabilidad;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = LocalDateTime.now();
    }

    protected SentimentStat() {
        // JPA
    }

    public SentimentStat(String text, Prevision prevision, Double probabilidad) {
        this.text = text;
        this.prevision = prevision;
        this.probabilidad = probabilidad;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public Prevision getPrevision() {
        return prevision;
    }

    public Double getProbabilidad() { return probabilidad; }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}


