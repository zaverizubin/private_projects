package com.smartlist.dto.assessment.request;

import com.smartlist.module.assessment.AssessmentController;
import com.smartlist.module.assessment.AssessmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AssessmentController.class)
class AssessmentDTOTests {

    @Autowired
    private AssessmentController assessmentController;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AssessmentService service;

    @Test
    public void shouldReturnDefaultMessage() throws Exception {
        this.mockMvc.perform(get("/organization/1/getAllByOrganization/assessment/abc")
                        .contentType("application/json"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldReturnDefaultMessage1() throws Exception {
        this.mockMvc.perform(get("/assessment/1")
                .contentType("application/json"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", hasSize(0)));
    }

}
