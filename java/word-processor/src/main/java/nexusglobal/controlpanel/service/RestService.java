package nexusglobal.controlpanel.service;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.Header;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.BasicHttpClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.apache.http.ssl.SSLContexts;
import org.apache.http.ssl.TrustStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.net.ssl.SSLContext;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class RestService {

	static Logger errorLogger = LoggerFactory.getLogger("error");

	private String username;
	private String password;
	private String baseURL;

	public HttpHeaders getDefaultHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return headers;
	}

	public <T> T post(final String requestMapping, final HttpEntity<T> entity, final Class<T> responseType) {
		final String url = this.baseURL + requestMapping;
		return getRestTemplate().postForObject(url, entity, responseType);
	}

	public <T, U> U post(final String requestMapping, @Nullable final HttpEntity<T> entity, final Class<U> responseType, final Object... pathVariables) {
		final String url = this.baseURL + requestMapping;
		return getRestTemplate().postForObject(url, entity, responseType, pathVariables);
	}

	public <T> T get(final String requestMapping, final Class<T> responseType, final Object... pathVariables) {
		final String url = this.baseURL + requestMapping;
		return getRestTemplate().getForObject(url, responseType, pathVariables);
	}

	public RestTemplate getRestTemplate() {
		RestTemplate restTemplate;

		final List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
		MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
		converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
		messageConverters.add(converter);

		try {
			final TrustStrategy acceptingTrustStrategy = (cert, authType) -> true;
			final SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();
			final SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);

			Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create()
					.register("https", sslsf).register("http", new PlainConnectionSocketFactory()).build();

			Header authorizationHeader = null;
			if(!StringUtils.isEmpty(this.username) && !StringUtils.isEmpty(this.password)) {
				String credentials = String.format("%s:%s", this.username, this.password);
				credentials = Base64.getEncoder().encodeToString(credentials.getBytes());
				authorizationHeader = new BasicHeader(org.apache.http.HttpHeaders.AUTHORIZATION, "Basic " + credentials);
			}

			BasicHttpClientConnectionManager connectionManager = new BasicHttpClientConnectionManager(socketFactoryRegistry);
			HttpClientBuilder httpClientBuilder = HttpClients.custom().setSSLSocketFactory(sslsf).setConnectionManager(connectionManager);
			if(authorizationHeader != null){
				httpClientBuilder.setDefaultHeaders(Arrays.asList(authorizationHeader));
			}

			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClientBuilder.build());
			restTemplate = new RestTemplate(requestFactory);

		} catch (KeyStoreException | NoSuchAlgorithmException | KeyManagementException e) {
			errorLogger.error(e.getMessage(), e);
			restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory());
		}

		restTemplate.setMessageConverters(messageConverters);

		return restTemplate;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getBaseURL() {
		return this.baseURL;
	}

	public void setBaseURL(String baseURL) {
		this.baseURL = baseURL;
	}

}
