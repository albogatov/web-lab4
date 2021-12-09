package app.configs;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource getDataSource() {
        DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
        dataSourceBuilder.driverClassName("oracle.jdbc.driver.OracleDriver");
        dataSourceBuilder.url("jdbc:oracle:thin:@localhost:1521:XE");
        dataSourceBuilder.username("SYSTEM");
        dataSourceBuilder.password("user");
//        dataSourceBuilder.url("jdbc:oracle:thin:@localhost:1521:orbis");
//        dataSourceBuilder.username("");
//        dataSourceBuilder.password("");
        return dataSourceBuilder.build();
    }
}