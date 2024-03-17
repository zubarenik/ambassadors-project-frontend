import { RendererElement } from 'vue';
import Loader from './AppLoader.vue';
import Icon from './AppIcon.vue';
import OverflownContainer from './AppOverflownContainer.vue';
import SkeletonPreview from './preview/SkeletonPreview.vue';
import AppImage from './AppImage.vue';

// Input components
import Input from './input/AppInput.vue';
import Select from './input/AppSelect.vue';
import Checkbox from './input/AppCheckbox.vue';
import Switch from './input/AppSwitch.vue';
import Textarea from './input/AppTextarea.vue';

// Button components
import Button from './button/AppButton.vue';

// Form components
import Form from './form/AppForm.vue';
import TextField from './form/TextField.vue';
import SelectField from './form/SelectField.vue';
import CheckboxField from './form/CheckboxField.vue';
import SwitchField from './form/SwitchField.vue';
import HugeTextField from './form/HugeTextField.vue';
import Required from './form/AppRequired.vue';

const registerComponents = (app: RendererElement) => {
  app.component('AppButton', Button);
  app.component('AppLoader', Loader);
  app.component('AppIcon', Icon);
  app.component('AppInput', Input);
  app.component('AppSelect', Select);
  app.component('AppCheckbox', Checkbox);
  app.component('AppSwitch', Switch);
  app.component('AppTextarea', Textarea);
  app.component('AppForm', Form);
  app.component('TextField', TextField);
  app.component('SelectField', SelectField);
  app.component('CheckboxField', CheckboxField);
  app.component('SwitchField', SwitchField);
  app.component('HugeTextField', HugeTextField);
  app.component('AppOverflownContainer', OverflownContainer);
  app.component('SkeletonPreview', SkeletonPreview);
  app.component('AppImage', AppImage);
  app.component('AppRequired', Required);
};

export default registerComponents;
