package app.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "RESULT_TBL")
public class Result implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name="result_id")
    private long id;
    @Column(name="result_x")
    private Double x;
    @Column(name="result_y")
    private Double y;
    @Column(name="result_r")
    private Double r;
    @Column(name="result_hit")
    private Boolean hit;
    @ManyToOne
    private User user;


}
