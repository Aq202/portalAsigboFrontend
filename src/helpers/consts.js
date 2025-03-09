export default {
  roles: {
    admin: 'admin',
    scolarshipHolder: 'scolarshipHolder',
    promotionResponsible: 'promotionResponsible',
    asigboAreaResponsible: 'asigboAreaResponsible',
    activityResponsible: 'activityResponsible',
    treasurer: 'treasurer',
  },
  promotionsGroups: {
    chick: 'chick',
    student: 'student',
    graduate: 'graduate',
  },
  imageRoute: {
    user: 'image/user',
    area: 'image/area',
    activity: 'image/activity',
    assignment: 'image/assignment',
  },
  importHeaders: ['Nombres', 'Apellidos', 'Correo', 'Promoción', 'Carrera', 'Universidad', 'Campus', 'Sexo'],
  usersTemplateFile: 'plantilla-importar-usuarios-asigbo.xlsx',
  sex: {
    masculine: 'M',
    femenine: 'F',
  },
  firstAccessKey: 'firstAccess',
};
