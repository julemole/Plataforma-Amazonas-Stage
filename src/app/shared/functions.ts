import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from "sweetalert2";

// Función para validar y formatear el nombre de un archivo
export const validateAndFormatFileName = (fileName: string): string => {
  const regex = /[,;:'"¡!¿?@#%^&*()+={}[\]|\\/><`~áéíóúÁÉÍÓÚñÑ]/g;
  if (regex.test(fileName)) {
      Swal.fire({
          icon: 'warning',
          iconColor: '#FCB424',
          title: '¡Aviso!',
          color: '#858585',
          text: 'El nombre del archivo contiene caracteres no permitidos. Serán removidos.',
          confirmButtonColor: '#5378AC'
      });
      return fileName.replace(regex, '');
  }
  return fileName;
}

// Método para validar si el email ya existe en la base de datos
// export const emailExistsValidator = (emails: UserData[], user?: UserData): ValidatorFn => {
//   return (control: AbstractControl): ValidationErrors | null => {
//     if(user) emails = emails.filter(item => item.id !== user.id);
//     const emailExist = emails.some(item => item.attributes.mail === control.value);
//     return emailExist ? { 'emailExists': true } : null;
//   };
// }

// Función para cargar un archivo en un input validando su tamaño y formato
export const onFileSelected = (event: any, isDoc: boolean) => {
  const MAX_SIZE_FILE = 5000000;
  const file: File = event.target.files[0];
  if(file){
    if (isDoc && file.type !== 'application/pdf') {
      warningAction('Error de formato', 'Por favor, sube un archivo en formato adecuado.')
      return;
    }

    if (!isDoc && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/gif') {
      warningAction('Error de formato', 'Por favor, sube un archivo en formato adecuado.')
      return;
    }

    if (file.size > MAX_SIZE_FILE) {
      errorAction('Error', 'El archivo no puede superar los 5MB.');
      return;
    }

    successfulAction('Archivo cargado', 'El archivo se ha cargado correctamente. No olvides guardar los cambios');
    const formattedFileName = validateAndFormatFileName(file.name);
    const formattedFile = new File([file], formattedFileName, { type: file.type });
    const objectUrl = URL.createObjectURL(file);

    return {file: formattedFile, url: objectUrl};
  }else{
    return null;
  }



}

// Función para obtener un control de un formulario
export const getControl = (form: FormGroup, fieldName: string): FormControl => {
  return form.get(fieldName) as FormControl;
}

export const getErrorMessage = (formControl: FormControl, min?: string, max?: string): string => {
  if ((formControl.dirty || formControl.touched) && formControl.hasError('required')) {
    return 'Este campo es obligatorio';
  }

  if (formControl && formControl.hasError('minlength')) {
    return `El campo debe contener al menos ${min} caracteres`;
  }

  if (formControl && formControl.hasError('email')) {
    return `La información ingresada no corresponde a un correo electrónico`;
  }

  if (formControl && formControl.hasError('maxlength')) {
    return `El campo no debe contener más de ${max} caracteres`;
  }

  if (formControl && formControl.hasError('pattern')) {
    return 'El formato del campo es incorrecto';
  }

  if (formControl && formControl.hasError('range')) {
    return 'El valor debe estar entre 0 y 100';
  }

  return '';
}

// Función con la lógica para buscar (keywords, asociaciones y roles)
export const onSearchChange = (event: Event | string, avalaibleContent: any[], content: any[], selectedItems: any[], showItems: boolean) => {
  const search = typeof event === 'string' ? event : (event.target as HTMLInputElement).value.trim();
  if (search.length > 0) {
    avalaibleContent = content.filter(item => {
      let itemSearch: string;
      if(item.attributes.name){
        itemSearch = item.attributes.name;
      }else if(item.attributes.label){
        itemSearch = item.attributes.label;
      }else{
        itemSearch = item.attributes.title;
      }
      return itemSearch.toLowerCase().includes(search.toLowerCase()) &&
      !selectedItems.some(selectedItem => selectedItem.id === item.id);
    });
    showItems = avalaibleContent.length > 0;
  } else {
    avalaibleContent = content.filter(item => !selectedItems.some(selectedItem => selectedItem.id === item.id));
    showItems = avalaibleContent.length > 0;
  }

  return {avalaibleContent, selectedItems, showItems};
}

// Función de validación personalizada para un rango de valores
export const rangeValidator = (min: number, max: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < min || value > max)) {
      return { range: { min, max } };
    }
    return null;
  };
}

// Función de validación personalizada para que una fecha de inicio no sea mayor a una fecha de fin
export function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if (!startDate || !endDate) {
    return null; // No validar si alguna fecha está vacía
  }

  return new Date(startDate) > new Date(endDate) ? { dateRange: true } : null;
}

//Alertas

export const successfulAction= (title: string, message: string, validClose: boolean = true): Promise<any> => {
  const iconColor = getComputedStyle(document.documentElement).getPropertyValue('--color-secundario').trim();
  return Swal.fire({
    title: title,
    // text: message,
    allowOutsideClick: validClose,
    html: message,
    icon: 'success',
    iconColor,
    customClass: {
      confirmButton: 'btn btn-primary',
    },
    confirmButtonText: 'Aceptar'
  });
}

export const errorAction= (title: string, message: string): Promise<any> => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'error',
    customClass: {
      confirmButton: 'btn btn-primary',
    },
    confirmButtonText: 'Aceptar'
  });
}

export const warningAction= (title: string, message: string): Promise<any> => {
  return Swal.fire({
    title: title,
    text: message,
    icon: 'warning',
    iconColor: '#ffcc00',
    showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      },
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
  });
}

export const deleteParametric= (): Promise<any> => {
  return Swal.fire({
    title: 'Eliminar contenido',
    text: 'Está seguro de eliminar esta información?',
    icon: 'warning',
    iconColor: '#ffcc00',
    showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger'
      },
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
  });
}

