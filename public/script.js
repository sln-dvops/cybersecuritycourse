document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("courseForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusDiv = document.getElementById("form-status");

  const ackRadios = document.querySelectorAll("input[name='acknowledge']");
  const extraSections = document.getElementById("extra-sections");

  const quizRadios = document.querySelectorAll("input[name='startQuiz']");
  const quizSection = document.getElementById("quiz-section");

  const nameField = document.getElementById("name");
  const companyField = document.getElementById("company");
  const emailField = document.getElementById("email");

  const finalAckRadios = document.querySelectorAll("input[name='finalAcknowledge']");
  const finalAckError = document.getElementById("final-ack-error");

  const quizAnswers = {
    q1: "D", q2: "C", q3: "C", q4: "A", q5: "D",
    q6: "B", q7: "B", q8: "B", q9: "C", q10: "C",
    q11: "B", q12: "B", q13: "A"
  };

  submitBtn.disabled = true; // Disable submit by default

  // ---------------------------
  // Disable submit helper
  // ---------------------------
  function disableSubmit() {
    submitBtn.disabled = true;
  }

  // ---------------------------
  // Acknowledgment handler
  // ---------------------------
  ackRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      extraSections.classList.toggle("hidden", radio.value !== "yes");
    });
  });

  // ---------------------------
  // Quiz start handler
  // ---------------------------
  quizRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      quizSection.classList.toggle("hidden", radio.value !== "yes");
    });
  });
// ---------------------------
// Quiz question handling
// ---------------------------
Object.keys(quizAnswers).forEach((qKey, index) => {
  const options = document.querySelectorAll(`.option[data-question='${qKey}']`);
  const feedback = document.getElementById(`feedback-${qKey}`);

  options.forEach(option => {
    option.addEventListener("click", () => {
      options.forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");

      const selectedValue = option.getAttribute("data-value");
      const isCorrect = selectedValue === quizAnswers[qKey];

      feedback.textContent = isCorrect ? "Correct!" : "Incorrect, try again.";
      feedback.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;

      if (isCorrect) {
        // Show only the next question
        const nextQuestion = document.getElementById(`quiz-${index + 2}`);
        if (nextQuestion) nextQuestion.classList.remove("hidden");
      } else {
        // Hide ALL questions below this one
        for (let i = index + 2; i <= Object.keys(quizAnswers).length; i++) {
          const questionEl = document.getElementById(`quiz-${i}`);
          if (questionEl) {
            questionEl.classList.add("hidden");

            // Reset answers & feedback for all hidden questions
            const nextOptions = questionEl.querySelectorAll(".option");
            nextOptions.forEach(opt => opt.classList.remove("selected"));
            const nextFeedback = questionEl.querySelector(".feedback");
            if (nextFeedback) {
              nextFeedback.textContent = "";
              nextFeedback.className = "feedback";
            }
          }
        }
      }
    });
  });
});


  // ---------------------------
  // Final acknowledgment (Q13)
  // ---------------------------
  finalAckRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "yes") {
        finalAckError.textContent = "";
        // Enable submit immediately
        submitBtn.disabled = false;
      } else {
        finalAckError.textContent = "⚠ You must acknowledge before submitting.";
        submitBtn.disabled = true;
      }
    });
  });

  // ---------------------------
  // Field input listeners
  // ---------------------------
  [nameField, companyField, emailField].forEach(field => {
    field.addEventListener("input", () => {
      // Only allow submit if Q13 is "Yes" and fields are filled
      const finalAckSelected = document.querySelector("input[name='finalAcknowledge']:checked");
      if (
        finalAckSelected && 
        finalAckSelected.value === "yes" &&
        nameField.value.trim() &&
        companyField.value.trim() &&
        emailField.value.trim()
      ) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    });
  });
// ---------------------------
// Submit handler
// ---------------------------
form.addEventListener("submit", e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  statusDiv.textContent = "⏳ Submitting, please wait...";
  statusDiv.style.color = "black";

  fetch("/submit-form", {   // 👈 changed URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameField.value.trim(),
      company: companyField.value.trim(),
      email: emailField.value.trim(),
      message: "We sincerely appreciate your engagement in this important initiative.\nBy completing this training, you’ve taken an essential step in helping us maintain a safe, secure, and resilient IT environment across Gurusoft."
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "confirmation.html";
    } else {
      statusDiv.textContent = "❌ " + data.error;
      statusDiv.style.color = "red";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  })
  .catch(err => {
    statusDiv.textContent = "❌ Submission failed. Try again later.";
    statusDiv.style.color = "red";
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
    console.error(err);
  });
});

});
