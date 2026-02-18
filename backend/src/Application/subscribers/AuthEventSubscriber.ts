import { Service } from "typedi";
import { EventBus } from "../../Infrastructure/events/EventBus";
import {
  AUTH_EVENTS,
  IPasswordResetEvent,
} from "../../Domain/interfaces/events/IAuthEvents";
import { MailService } from "../services/MailService";

@Service()
export class AuthEventSubscriber {
  constructor(
    private eventBus: EventBus,
    private mailService: MailService,
  ) {
    this.listen();
  }

  private listen() {
    this.eventBus.on(
      AUTH_EVENTS.PASSWORD_RESET_REQUESTED,
      async (data: IPasswordResetEvent) => {
        try {
          console.log(
            `[Observer] Processando e-mail de reset para: ${data.email}`,
          );

          await this.mailService.sendResetUserPassword(
            data.nome,
            data.email,
            data.url,
          );

          console.log(`[Observer] E-mail enviado com sucesso!`);
        } catch (error) {
          console.error(`[Observer Error] Falha ao enviar e-mail:`, error);
        }
      },
    );

    // Você pode ouvir outros eventos aqui (ex: USER_REGISTERED)
  }
}
