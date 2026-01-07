package com.email.EmailAssistance.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest){
        // BUild the prompt
        String prompt=buildPrompt(emailRequest);
        // craft a request
//        {
//            "contents": [
//            {
//                "parts": [
//                {
//                    "text": "your prompt value here"
//                }
//      ]
//            }
//  ]
//        }  below code is for this using map

        Map<String, Object> requestBody=Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text",prompt)
                                }
                        )
                }
        );
        // do request and get reaponse

        String response= webClient.post()
                .uri(geminiApiUrl + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        // WebClient is used to communicate with other web services (APIs) over HTTP


        // extract response and return response

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response){
        try {
            ObjectMapper mapper= new ObjectMapper();
            JsonNode rootNode=mapper.readTree(response);
            return rootNode
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();
        }
        catch (Exception e){
            return "Error processing request" + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt= new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't generate the subject line.");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
