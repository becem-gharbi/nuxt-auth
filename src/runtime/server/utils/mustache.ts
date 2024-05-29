export const mustache = {
  render: (template: string, view: object) => {
    const keys = Object.keys(view)

    keys.forEach((key) => {
      template = template.replaceAll(`{{${key}}}`, view[key as keyof typeof view])
    })

    return template
  },
}
