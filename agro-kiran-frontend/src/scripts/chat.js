import { renderHeader } from "../components/header";
import { renderFooter } from "../components/footer";
import { showToast } from "../utils/toast";
import { isAuthenticated, getAuthToken } from "../utils/auth";
import { API_CONFIG } from "../config/api.js";
import { productService } from "../services/productService.js";
import { marked } from 'marked';

// Configure marked options for security and styling
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // Enable GitHub Flavored Markdown
  headerIds: false, // Disable header IDs for security
  mangle: false, // Disable mangling for security
  sanitize: true, // Sanitize HTML input
});

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await renderHeader();
  await renderFooter();
  initializeChat();
});

function initializeChat() {
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-message");
  const chatMessages = document.getElementById("chat-messages");
  const quickActionButtons = document.querySelectorAll(".quick-action-btn");

  // Add scrollable styles to chat messages
  chatMessages.style.maxHeight = "60vh";
  chatMessages.style.overflowY = "auto";

  // Custom styles for markdown content
  const markdownStyles = document.createElement('style');
  markdownStyles.textContent = `
    .message-content {
      line-height: 1.5;
    }
    .message-content p {
      margin-bottom: 0.5rem;
    }
    .message-content ul, .message-content ol {
      margin-left: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .message-content li {
      margin-bottom: 0.25rem;
    }
    .message-content h1, .message-content h2, .message-content h3, 
    .message-content h4, .message-content h5, .message-content h6 {
      margin: 1rem 0 0.5rem;
      font-weight: bold;
    }
    .message-content code {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }
    .message-content pre {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 5px;
      overflow-x: auto;
      margin: 0.5rem 0;
    }
    .message-content blockquote {
      border-left: 3px solid rgba(255, 255, 255, 0.5);
      padding-left: 1rem;
      margin: 0.5rem 0;
      font-style: italic;
    }
    .message-content table {
      border-collapse: collapse;
      margin: 0.5rem 0;
      width: 100%;
    }
    .message-content th, .message-content td {
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.5rem;
    }
    .message-content th {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `;
  document.head.appendChild(markdownStyles);

  // Load chat history when page loads
  loadChatHistory();

  // Handle send button click
  sendButton.addEventListener("click", () => sendMessage());

  // Handle enter key press
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Handle quick action buttons
  quickActionButtons.forEach(button => {
    button.addEventListener("click", () => {
      const action = button.querySelector("span").textContent;
      messageInput.value = action;
      sendMessage();
    });
  });

  function addLoadingIndicator() {
    const loadingElement = document.createElement("div");
    loadingElement.className = "chat-message bot loading-message";
    loadingElement.innerHTML = `
      <div class="avatar">
        <i class="fas fa-robot text-amber-100 text-sm"></i>
      </div>
      <div class="message-content flex items-center gap-2">
        <span class="text-white">Thinking</span>
        <div class="loading-dots flex gap-1">
          <div class="dot bg-white w-2 h-2 rounded-full animate-bounce"></div>
          <div class="dot bg-white w-2 h-2 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="dot bg-white w-2 h-2 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    `;
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingElement;
  }

  async function loadChatHistory() {
    try {
      if (!isAuthenticated()) {
        showToast("Please login to use the chat feature", "error");
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.GET_HISTORY}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        }
      });

      if (!response.ok) throw new Error('Failed to load chat history');

      const data = await response.json();
      
      // Clear existing messages except welcome message
      const welcomeMessage = chatMessages.firstElementChild;
      chatMessages.innerHTML = '';
      chatMessages.appendChild(welcomeMessage);

      // Add history messages
      for (const msg of data.messages) {
        const slugMatch = msg.content.match(/slug: ([a-z0-9-]+)/);
        if (slugMatch && msg.role === 'assistant') {
          const productSlug = slugMatch[1];
          const product = await productService.fetchProduct(productSlug);
          addMessage(msg.content, 'bot', productSlug, product);
        } else {
          addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot');
        }
      }

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
      console.error('Error loading chat history:', error);
      showToast("Failed to load chat history", "error");
    }
  }

  async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    if (!isAuthenticated()) {
      showToast("Please login to use the chat feature", "error");
      return;
    }

    // Add user message
    addMessage(message, "user");
    messageInput.value = "";

    // Add loading indicator
    const loadingIndicator = addLoadingIndicator();

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT.SEND_MESSAGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Remove loading indicator
      loadingIndicator.remove();

      const data = await response.json();
      
      // If there's a product slug, fetch the product details
      if (data.productSlug) {
        const product = await productService.fetchProduct(data.productSlug);
        addMessage(data.message, "bot", data.productSlug, product);
      } else {
        addMessage(data.message, "bot");
      }
    } catch (error) {
      // Remove loading indicator
      loadingIndicator.remove();
      console.error('Error sending message:', error);
      showToast("Failed to send message", "error");
    }
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "bg-white p-3 rounded-lg mt-2 border-2 border-primary";
    
    card.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${product.img['5kg']}" alt="${product.title}" class="w-16 h-16 object-cover rounded">
        <div>
          <h3 class="font-bold text-primary">${product.title}</h3>
          <p class="text-sm text-primary/70">${product.shortDesc}</p>
          <a href="product.html?id=${product.id}" class="inline-block mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-accent transition-colors">
            <i class="fas fa-external-link-alt mr-2"></i>View Product
          </a>
        </div>
      </div>
    `;
    
    return card;
  }

  function parseMarkdown(content) {
    // First, temporarily protect product slug links
    content = content.replace(/slug: ([a-z0-9-]+)/g, '§§SLUG§§$1§§END§§');

    // Parse markdown
    let parsedContent = marked(content);

    // Restore and format product slug links
    parsedContent = parsedContent.replace(
      /§§SLUG§§([a-z0-9-]+)§§END§§/g,
      (match, slug) => `<a href="product.html?id=${slug}" class="text-amber-200 hover:underline">${slug}</a>`
    );

    return parsedContent;
  }

  function addMessage(message, type = "bot", productSlug = null, productDetails = null) {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${type}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerHTML = type === "user" 
      ? '<i class="fas fa-user text-white text-sm"></i>'
      : '<i class="fas fa-robot text-amber-100 text-sm"></i>';

    const content = document.createElement("div");
    content.className = "message-content";
    
    // Parse markdown and handle product links
    if (type === "user") {
      content.textContent = message;
    } else {
      content.innerHTML = parseMarkdown(message);
    }

    if (type === "user") {
      messageElement.appendChild(content);
      messageElement.appendChild(avatar);
    } else {
      messageElement.appendChild(avatar);
      messageElement.appendChild(content);
      
      // Add product card if product details are available
      if (productDetails) {
        const productCard = createProductCard(productDetails);
        content.appendChild(productCard);
      }
    }

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
} 