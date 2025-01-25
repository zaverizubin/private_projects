package com.smartlist.interceptors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.slf4j.LoggerFactory;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Enumeration;

@Slf4j
public class LoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(final @NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) {
        logRequestInfo(request, handler);
        return true;
    }

    private void logRequestInfo(final @NotNull HttpServletRequest request, final Object handler){
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Request FROM:").append(getRemoteAddress(request)).append("; ");
        stringBuilder.append("Request VERB:").append(request.getMethod()).append("; ");
        stringBuilder.append("Request URI:").append(request.getRequestURI()).append("; ");
        stringBuilder.append("Method NAME:").append(getMethodName(handler)).append("; ");
        stringBuilder.append("Request PATH:").append(request.getServletPath()).append("; ");
        stringBuilder.append("Request PARAMS:").append(getQueryParameters(request)).append("; ");
       // stringBuilder.append("Request BODY:").append(getRequestBody(request)).append("; ");

        if(handler instanceof HandlerMethod handlerMethod) {
            Class<?> controllerClass = handlerMethod.getBeanType();
            LoggerFactory.getLogger(controllerClass).info("{}", stringBuilder);
        }
    }

    private String getMethodName(final Object handler){
        if(handler instanceof HandlerMethod handlerMethod){
           return handlerMethod.getMethod().getName();
        }
        return "";
    }

    private String getRemoteAddress(final HttpServletRequest request) {
        String ipFromHeader = request.getHeader("X-FORWARDED-FOR");
        if (ipFromHeader != null && ipFromHeader.length() > 0) {
            return ipFromHeader;
        }
        return request.getRemoteAddr();
    }

    private String getQueryParameters(final HttpServletRequest request) {
        StringBuilder posted = new StringBuilder();
        Enumeration<?> e = request.getParameterNames();
        if (e != null) {
            posted.append("?");
            while (e.hasMoreElements()) {
                if (posted.length() > 1) {
                    posted.append("&");
                }
                String curr = (String) e.nextElement();
                posted.append(curr).append("=");
                if (curr.toLowerCase().contains("password") || curr.toLowerCase().contains("pass") || curr.toLowerCase().contains("pwd")) {
                    posted.append("*****");
                } else {
                    posted.append(request.getParameter(curr));
                }
            }
        }
        return posted.toString();
    }

    public String getRequestBody(final HttpServletRequest request)  {
        /*This method does not work. Need to re-investigate later*/
        String body = "";

        MyHttpServletRequestWrapper requestWrapper;
        if (request != null) {
            requestWrapper = new MyHttpServletRequestWrapper(request);
            return requestWrapper.getBody();
        }
        return body;
    }
}