package com.smartlist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class SmartlistApp extends SpringBootServletInitializer {


	/*@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder springApplicationBuilder) {
		return springApplicationBuilder.sources(SmartlistApp.class);
	}*/

	//Invoked if using the embedded tomcat server
	public static void main(String[] args) {
		SpringApplication.run(SmartlistApp.class, args);
	}

}
