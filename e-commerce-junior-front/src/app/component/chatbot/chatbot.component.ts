import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from 'src/app/services/chatservice.service';
import { AimlService } from 'src/app/services/aimlapi.service';
import { StorageService } from 'src/app/services/storage.service';
import { ProductService } from 'src/app/services/product.service';
import { ShopingCarService } from 'src/app/services/shoping-car-service.service';
import { Product } from 'src/app/models/product.model';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ApiRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatHistory') private chatHistoryRef!: ElementRef;

  userInput: string = '';
  messages: ChatMessage[] = [];
  user: any = null;
  isLoading: boolean = false;
  searchResults: Product[] = [];
  addedToCartMessage: string = '';
  hasScrolledToBottom: boolean = false;
  retryCount: number = 0;
  maxRetries: number = 3;

  constructor(
    private aimlService: AimlService,
    private storageService: StorageService,
    private chatService: ChatService,
    private productService: ProductService,
    private shopingCarService: ShopingCarService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    const welcomeMessage = this.user
      ? `Hola ${this.user.username}, soy tu Agente AI. Estoy aquí para ayudarte con compras, recomendaciones o cualquier pregunta. ¿En qué puedo ayudarte hoy?`
      : `Hola, soy tu Agente AI. Puedo ayudarte con compras, recomendaciones o cualquier duda. ¿En qué te ayudo?`;

    this.messages.push({ role: 'assistant', content: welcomeMessage });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.chatHistoryRef && !this.hasScrolledToBottom) {
        this.chatHistoryRef.nativeElement.scrollTop = this.chatHistoryRef.nativeElement.scrollHeight;
        this.hasScrolledToBottom = true;
      }
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  resetScroll(): void {
    this.hasScrolledToBottom = false;
  }

  sendMessage() {
    if (this.userInput.trim() === '' || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ role: 'user', content: userMessage });
    this.userInput = '';
    this.isLoading = true;
    this.resetScroll();

    this.processUserInput(userMessage);
  }

  processUserInput(input: string) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('busca productos')) {
      this.searchProducts(lowerInput.replace('busca productos', '').trim());
    } else if (lowerInput.includes('recomiéndame algo')) {
      this.recommendProducts();
    } else if (lowerInput === 'ayuda') {
      this.showHelp();
    } else {
      this.getAIResponse(input);
    }
  }

  getAIResponse(query: string) {
    const aiMessages = this.prepareMessagesForAI(query);
    const requestBody: ApiRequest = {
      model: 'aiml-gpt',
      messages: aiMessages,
      max_tokens: 200,
      temperature: 0.8
    };
    console.log('Enviando solicitud a:', this.aimlService['apiUrl']); // Verifica la URL
    console.log('Cuerpo de la solicitud:', JSON.stringify(requestBody));
    this.aimlService.getChatResponse(requestBody)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          console.log('Respuesta recibida:', response);
          const botResponse = response.choices?.[0]?.message?.content || 'No pude procesar tu solicitud.';
          this.messages.push({ role: 'assistant', content: botResponse });
          this.resetScroll();
        },
        error: (error) => {
          console.error('Error completo:', error);
          this.handleErrorResponse(`Error al conectar con la IA: ${error.message}`);
        }
      });
  }

  handleErrorResponse(errorMessage: string) {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.getAIResponse(this.messages[this.messages.length - 1].content), 1000 * this.retryCount);
    } else {
      this.messages.push({ role: 'assistant', content: `Lo siento, algo salió mal. ${errorMessage}` });
      this.resetScroll();
    }
  }

  prepareMessagesForAI(query: string): ChatMessage[] {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `Eres un Agente AI avanzado y profesional. Ayudas con compras, recomendaciones y preguntas generales. Responde en español, de forma clara, concisa y útil. Para "${query}", ofrece una respuesta inteligente y práctica.`
    };
    return [systemMessage, ...this.messages.slice(-5)];
  }

  searchProducts(query: string) {
    this.productService.getAllSimple().subscribe({
      next: (products) => {
        this.searchResults = products.filter(product =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
        this.messages.push({
          role: 'assistant',
          content: this.searchResults.length > 0
            ? `Encontré ${this.searchResults.length} productos relacionados con "${query}".`
            : `No encontré productos para "${query}". ¿Quieres que busque algo más?`
        });
        this.isLoading = false;
        this.resetScroll();
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: 'Error al buscar productos.' });
        this.isLoading = false;
      }
    });
  }

  recommendProducts() {
    this.productService.getAllSimple().subscribe({
      next: (products) => {
        const recommendations = this.getRandomProducts(products, 3);
        this.searchResults = recommendations;
        this.messages.push({
          role: 'assistant',
          content: `Te recomiendo: ${recommendations.map(p => p.title).join(', ')}. ¿Te interesa alguno?`
        });
        this.isLoading = false;
        this.resetScroll();
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: 'Error al obtener recomendaciones.' });
        this.isLoading = false;
      }
    });
  }

  showHelp() {
    this.messages.push({
      role: 'assistant',
      content: 'Puedo ayudarte con:\n- "Busca productos [término]": Buscar productos.\n- "Recomiéndame algo": Sugerencias.\n- Preguntas generales. ¿Qué necesitas?'
    });
    this.isLoading = false;
    this.resetScroll();
  }

  getRandomProducts(products: Product[], count: number): Product[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  addToCart(product: Product) {
    this.shopingCarService.addShoppingCar(product);
    this.showAddedToCartMessage(product.title);
    this.messages.push({
      role: 'assistant',
      content: `Agregué "${product.title}" al carrito. ¿Algo más?`
    });
    this.resetScroll();
  }

  showAddedToCartMessage(productTitle: string) {
    this.addedToCartMessage = `${productTitle} agregado al carrito`;
    setTimeout(() => this.addedToCartMessage = '', 3000);
  }
}
