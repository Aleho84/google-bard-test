import Bard from "bard-ai";
import fs from 'fs';

// documentacion bard-ai: 'https://bard-ai.js.org/advanced/chat-import-export/';

class Bot {
    #cookie_ = '';
    #botName_ = '';
    #context_ = '';
    #chatId_ = {};
    #bard_ = {};
    #chat_ = {};

    constructor(cookie, botName, newChat) {
        if (!cookie) { throw new Error('Missing cookie'); }

        this.#cookie_ = cookie;
        this.#botName_ = botName || 'Aleho-Bot';
        this.#context_ = this.#readContext();
        this.#chatId_ = this.#readChatId();
        this.#bard_ = new Bard(this.#cookie_, {
            verbose: false,
            context: this.#context_
        });

        botName ? this.#botName_ = botName : null;
        this.cookie = cookie;

        if (newChat) {
            this.#chat_ = this.#bard_.createChat();
            this.#chat_.ask(this.#context_)
                .then(resp => {
                    this.#chatId_ = this.#chat_.export();
                    this.#writeChatId();
                })
        } else {
            this.#chat_ = this.#bard_.createChat(this.#chatId_);
        }
    }

    async chat(question) {
        let response = await this.#chat_.ask(this.#context_ + ' ' + question);
        return response;
    }

    get botName() {
        return this.#botName_;
    }

    get chatId() {
        return JSON.stringify(this.#chatId_);
    }

    get context() {
        return this.#context_;
    }

    #readChatId() {
        try {
            const data = fs.readFileSync('bot.json', 'utf-8');
            const jsonData = JSON.parse(data);
            return jsonData;
        } catch (error) {
            return null;
        }
    }

    #readContext() {
        try {
            const data = fs.readFileSync('bot.txt', 'utf-8');
            return data;
        } catch (error) {
            return null;
        }
    }

    #writeChatId() {
        try {
            fs.writeFileSync('bot.json', JSON.stringify(this.#chatId_, null, 2), 'utf8');
        } catch (error) {
            return;
        }
    }
}

export default Bot;