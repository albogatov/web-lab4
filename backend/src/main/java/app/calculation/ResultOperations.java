package app.calculation;

import app.entities.Result;
import org.springframework.stereotype.Component;

@Component
public class ResultOperations {
    private boolean checkFirstSector(double x, double y, double r) {
        return x >= 0 && y >= 0 && Math.abs(x) <= Math.abs(r) && y <= Math.abs(r) / 2;
    }

    private boolean checkSecondSector(double x, double y, double r) {
        return x <= 0 && y >= 0 && Math.abs(x) <= Math.abs(r) / 2 && y <= Math.abs(r) && y < (2 * x + Math.abs(r));
    }

    private boolean checkThirdSector(double x, double y, double r) {
        return x >= 0 && y <= 0 && Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) <= Math.abs(r);
    }

    public boolean checkHit(Result result) {
        double x = result.getX();
        double y = result.getY();
        double r = result.getR();
        return checkFirstSector(x, y, r) || checkSecondSector(x, y, r) || checkThirdSector(x, y, r);
    }
}
