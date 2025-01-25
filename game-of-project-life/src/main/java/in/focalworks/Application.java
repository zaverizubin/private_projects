package in.focalworks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import in.focalworks.backend.data.entity.User;
import in.focalworks.backend.repositories.UserRepository;


@SpringBootApplication(scanBasePackageClasses = { Application.class })
@EnableJpaRepositories(basePackageClasses = { UserRepository.class })
@EntityScan(basePackageClasses = { User.class })
public class Application extends SpringBootServletInitializer {

	public static void main(final String[] args) {
		final ApplicationContext applicationContext = SpringApplication.run(Application.class, args);
		for (final String name : applicationContext.getBeanDefinitionNames()) {
			System.out.println(name);
		}
	}

	@Override
	protected SpringApplicationBuilder configure(final SpringApplicationBuilder application) {
		return application.sources(Application.class);
	}
}