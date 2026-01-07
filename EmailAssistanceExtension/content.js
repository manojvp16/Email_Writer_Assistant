// console.log("Email Writer Extension - Content Script Loaded");

// function createAIButton() {
//   const button = document.createElement("div");
//   button.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
//   button.style.marginRight = "8px";
//   button.innerHTML = "AI Reply";
//   button.setAttribute("role", "button");
//   button.setAttribute("data-tooltip", "Generate AI Reply");
//   return button;
// }

// function getEmailContent() {
//   const selectors = [
//     ".h7",
//     ".a3s.aiL",
//     ".gmail_quote",
//     '[role="presentation"]',
//   ];
//   for (const selector of selectors) {
//     const content = document.querySelector(selector);
//     if (content) {
//       return content.innerText.trim();
//     }
//     return "";
//   }
// }

// function findComposeToolbar() {
//   const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];
//   for (const selector of selectors) {
//     const toolbar = document.querySelector(selector);
//     if (toolbar) {
//       return toolbar;
//     }
//     return null;
//   }
// }

// function injectButton() {
//   const existingButton = document.querySelector(".ai-reply-button");
//   if (existingButton) existingButton.remove();

//   const toolbar = findComposeToolbar();
//   if (!toolbar) {
//     console.log("Toolbar not found");
//     return;
//   }

//   console.log("Toolbar found, creating AI button");
//   const button = createAIButton();
//   button.classList.add("ai-reply-button");

//   button.addEventListener("click", async () => {
//     try {
//       button.innerHTML = "Generating...";
//       button.disabled = true;

//       const emailContent = getEmailContent();
//       const response = await fetch("http://localhost:8080/api/email/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           emailContent: emailContent,
//           tone: "professional",
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("API Request Failed");
//       }

//       const generatedReply = await response.text();
//       const composeBox = document.querySelector(
//         '[role="textbox"][g_editable="true"]'
//       );

//       if (composeBox) {
//         composeBox.focus();
//         document.execCommand("insertText", false, generatedReply);
//       } else {
//         console.error("Compose box was not found");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Failed to generate reply");
//     } finally {
//       button.innerHTML = "AI Reply";
//       button.disabled = false;
//     }
//   });

//   toolbar.insertBefore(button, toolbar.firstChild);
// }

// const observer = new MutationObserver((mutations) => {
//   for (const mutation of mutations) {
//     const addedNodes = Array.from(mutation.addedNodes);
//     const hasComposeElements = addedNodes.some(
//       (node) =>
//         node.nodeType === Node.ELEMENT_NODE &&
//         (node.matches('.aDh, .btC, [role="dialog"]') ||
//           node.querySelector('.aDh, .btC, [role="dialog"]'))
//     );

//     if (hasComposeElements) {
//       console.log("Compose Window Detected");
//       setTimeout(injectButton, 500);
//     }
//   }
// });

// observer.observe(document.body, {
//   childList: true,
//   subtree: true,
// });
console.log("Email Writer Extension - Content Script Loaded");

/* -------------------------------
   Create AI Reply Button
-------------------------------- */
function createAIButton() {
  const button = document.createElement("button");
  button.className = "ai-reply-button";
  button.textContent = "AI Reply";
  button.setAttribute("type", "button");
  button.setAttribute("title", "Generate AI Reply");
  return button;
}

/* -------------------------------
   Create Tone Dropdown
-------------------------------- */
function createToneDropdown() {
  const select = document.createElement("select");
  select.className = "ai-tone-dropdown";

  const tones = ["Professional", "Casual", "Friendly", "Funny"];

  tones.forEach((tone) => {
    const option = document.createElement("option");
    option.value = tone.toLowerCase();
    option.textContent = tone;
    select.appendChild(option);
  });

  // Load saved tone
  chrome.storage.local.get("selectedTone", (data) => {
    if (data.selectedTone) {
      select.value = data.selectedTone;
    }
  });

  // Save tone on change
  select.addEventListener("change", () => {
    chrome.storage.local.set({ selectedTone: select.value });
  });

  return select;
}

/* -------------------------------
   Get Email Content
-------------------------------- */
function getEmailContent() {
  const selectors = [
    ".a3s.aiL",
    ".gmail_quote",
    ".h7",
    '[role="presentation"]',
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
  }
  return "";
}

/* -------------------------------
   Find Compose Toolbar
-------------------------------- */
function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]'];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null;
}

/* -------------------------------
   Inject Button + Dropdown
-------------------------------- */
function injectButton() {
  // Prevent duplicates
  if (document.querySelector(".ai-reply-button")) return;

  const toolbar = findComposeToolbar();
  if (!toolbar) {
    console.log("Compose toolbar not found");
    return;
  }

  console.log("Compose toolbar found. Injecting AI controls.");

  const toneDropdown = createToneDropdown();
  const aiButton = createAIButton();

  aiButton.addEventListener("click", async () => {
    try {
      aiButton.textContent = "Generating...";
      aiButton.disabled = true;

      const emailContent = getEmailContent();
      const selectedTone =
        document.querySelector(".ai-tone-dropdown")?.value || "professional";

      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent,
          tone: selectedTone,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const generatedReply = await response.text();

      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );

      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
      } else {
        alert("Compose box not found");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI reply");
    } finally {
      aiButton.textContent = "AI Reply";
      aiButton.disabled = false;
    }
  });

  // Insert dropdown then button
  toolbar.insertBefore(aiButton, toolbar.firstChild);
  toolbar.insertBefore(toneDropdown, aiButton);
}

/* -------------------------------
   Observe Gmail DOM Changes
-------------------------------- */
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    const composeDetected = addedNodes.some(
      (node) =>
        node.nodeType === Node.ELEMENT_NODE &&
        (node.matches('[role="dialog"], .aDh, .btC') ||
          node.querySelector?.('[role="dialog"], .aDh, .btC'))
    );

    if (composeDetected) {
      console.log("Compose window detected");
      setTimeout(injectButton, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
