export const mustache = {
  render: (template: string, view: Record<string, any>) => {
    const keys = Object.keys(view)

    keys.forEach((key) => {
      template = template.replaceAll(`{{${key}}}`, view[key])
    })

    return template
  }
}
