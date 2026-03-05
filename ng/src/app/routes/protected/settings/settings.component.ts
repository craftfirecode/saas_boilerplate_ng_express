import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@core';
import { FolderSignalService as FolderService } from '../../../signal/folder-signal.service';
import { Accordion, AccordionItem } from '@ui/aria/accordion/accordion';
import { UsernameChange } from '@forms/settings/user/username-change/username-change';
import { PasswordChange } from '@forms/settings/user/password-change/password-change';
import { EmailChange } from '@forms/settings/user/email-change/email-change';
import { DeleteAccount } from '@forms/settings/user/delete-account/delete-account';
import { EmailTestComponent } from '../../testing/email/email-test.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Accordion,
    UsernameChange,
    PasswordChange,
    EmailChange,
    DeleteAccount,
    EmailTestComponent,
  ],
})
export class SettingsComponent {
  public readonly auth = inject(AuthService);
  public readonly folder = inject(FolderService);

  public get user() {
    return this.auth.getUser();
  }

  faqItems: AccordionItem[] = [
    { title: 'Was ist SAAS?', content: 'SAAS steht für Software as a Service.' },
    { title: 'Wie kann ich mein Passwort ändern?', content: 'Gehen Sie zu den Kontoeinstellungen und klicken Sie auf "Passwort ändern".' },
    { title: 'Wo finde ich meine Rechnungen?', content: 'Ihre Rechnungen finden Sie im Bereich "Abrechnung".' }
  ];
}
