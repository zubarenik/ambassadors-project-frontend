import * as Yup from 'yup';
import { FileService, FORMATS, SingletonFileManager } from '@/core/services/Files';
import { I18nInstance } from '@/core/services/I18n';

function buildYupStaticLink(i18n: I18nInstance) {
  Yup.addMethod(Yup.string, 'staticLink', function validateLink() {
    return this.test('staticLink', i18n.global.t('components.form.field.static_link'), (value) => {
      return SingletonFileManager.getInstance.isCorrectLink(value as string);
    });
  });

  for (const format of Object.values(FORMATS)) {
    Yup.addMethod(Yup.string, format, function validateLink() {
      return this.test(format, i18n.global.t('components.form.field.static_link'), (value) => {
        try {
          const file = new FileService({ path: value });
          return file.isValidType(format);
        } catch {
          return false;
        }
      });
    });
  }
}

export function buildYupLocale(i18n: I18nInstance) {
  Yup.setLocale({
    mixed: {
      required: i18n.global.t('components.form.field.required'),
    },
    string: {
      // email: i18n.global.t('email_form_field_valid'),
    },
  });
}

export default function buildYup(i18n: I18nInstance) {
  buildYupLocale(i18n);
  buildYupStaticLink(i18n);
}
