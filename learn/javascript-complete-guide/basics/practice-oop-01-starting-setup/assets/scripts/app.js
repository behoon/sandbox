class DOMHelper {
  static moveElement (elementId, newDestinationSelector) {
    const element = document.getElementById(elementId)
    const destinationElement = document.querySelector(newDestinationSelector)
    destinationElement.append(element)
    element.scrollIntoView({
      behavior: 'smooth'
    })
  }

  static clearEventListeners (element) {
    const clonedElement = element.cloneNode(true)
    element.replaceWith(clonedElement)
    return clonedElement
  }
}

class Component {
  constructor (hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId)
    } else {
      this.hostElement = document.body
    }

    this.insertBefore = insertBefore
  }

  detach () {
    if (this.element) {
      this.element.remove()
    }
  }
  
  attach () {
    this.hostElement.insertAdjacentElement(this.insertBefore ? 'beforebegin' : 'beforeend', this.element)
  }
}

class Tooltip extends Component {
  constructor (closeNotifierFunction, text, hostElementId) {
    super(hostElementId)
    this.closeNotifierHandler = closeNotifierFunction
    this.text = text
    this.create()
  }

  closeTooltip = () => {
    this.detach()
    this.closeNotifierHandler()
  }

  create () {
    const tooltipElement = document.createElement('div')
    tooltipElement.className = 'card'
    const tooltipTemplate = document.getElementById('tooltip')
    const tooltipBody = document.importNode(tooltipTemplate.content, true)
    tooltipBody.querySelector('p').textContent = this.text
    tooltipElement.append(tooltipBody)
    const hostElPosLeft = this.hostElement.offsetLeft
    const hostElPosTop = this.hostElement.offsetTop
    const hostElHeight = this.hostElement.clientHeight
    const parentElementScrolling = this.hostElement.parentElement.scrollTop

    const x = hostElPosLeft + 20
    const y = hostElPosTop + hostElHeight - parentElementScrolling - 10

    tooltipElement.style.position = 'absolute'
    tooltipElement.style.left = x + 'px'
    tooltipElement.style.top = y + 'px'
    tooltipElement.addEventListener('click',this.closeTooltip)
    this.element = tooltipElement
  }
}

class ProjectItem {
  hasActiveTooltip = false

  constructor (id, updateProjectListsFunction, type) {
    this.id = id
    this.updateProjectListsHandler = updateProjectListsFunction
    this.connectSwitchButton(type)
    this.connectMoreInfoButton()
    this.connectDrag()
  }

  update (updateProjectListsFunction, type) {
    this.updateProjectListsHandler = updateProjectListsFunction
    this.connectSwitchButton(type)
  }

  showMoreInfoHandler () {
    if (this.hasActiveTooltip) {
      return
    }
    const projectElement = document.getElementById(this.id)
    const tooltipText = projectElement.dataset.extraInfo
    const tooltip = new Tooltip(() => {
      this.hasActiveTooltip = false
    }, tooltipText, this.id)
    tooltip.attach()
    this.hasActiveTooltip = true
  }

  connectMoreInfoButton() {
    const projectItemElement = document.getElementById(this.id)
    const moreInfoButton = projectItemElement.querySelector('button:first-of-type')
    moreInfoButton.addEventListener('click', this.showMoreInfoHandler.bind(this))
  }

  connectDrag () {
    document.getElementById(this.id).addEventListener('dragstart', event => {
      event.dataTransfer.setData('text/plain', this.id)
      event.dataTransfer.effectAllowed = 'move'
    })

    document.getElementById(this.id).addEventListener('dragend', event => {
      console.log(event)
    })

  }

  connectSwitchButton (type) {
    const projectItemElement = document.getElementById(this.id)
    let switchButton = projectItemElement.querySelector('button:last-of-type')
    switchButton = DOMHelper.clearEventListeners(switchButton)
    switchButton.textContent = type === 'active' ? 'Finish' : 'Activate'
    switchButton.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id))
  }
}

class ProjectList {
  projects = []

  constructor (type) {
    this.type = type
    const projectItems = document.querySelectorAll(`#${type}-projects li`)
    for (const projectItem of projectItems) {
      this.projects.push(new ProjectItem(projectItem.id, this.switchProject.bind(this), this.type))
    }
    console.log(this.projects)
    this.connectDroppable()
  }

  connectDroppable () {
    const list = document.querySelector(`#${this.type}-projects ul`)

    list.addEventListener('dragenter', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        list.parentElement.classList.add('droppable')
        event.preventDefault()
      }
    })
    list.addEventListener('dragover', event => {
      if (event.dataTransfer.types[0] === 'text/plain') {
        event.preventDefault()
      }
    })
    list.addEventListener('dragleave', event => {
      if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== list)
      list.parentElement.classList.remove('droppable')
    })
    list.addEventListener('drop', event => {
      const projectId = event.dataTransfer.getData('text/plain')
      if (this.projects.find(project => project.id === projectId)) {
        return
      }

      document.getElementById(projectId).querySelector('button:last-of-type').click()
      list.parentElement.classList.add('droppable')
      event.preventDefault()
    })
  }

  setSwitchHandler (switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction
  }

  addProject (project) {
    this.projects.push(project)
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`)
    project.update(this.switchProject.bind(this), this.type)
  }
  
  switchProject (projectId) {
    // const projectIndex = this.projects.findIndex(project => project.id === projectId)
    // this.projects.splice(projectIndex, 1)
    this.switchHandler(this.projects.find(project => project.id === projectId))
    this.projects = this.projects.filter(project => project.id !== projectId)
  }
}

class App {

  static init () {
    const activeProjectsList = new ProjectList('active', )
    const finishedProjectsList = new ProjectList('finished')
    activeProjectsList.setSwitchHandler(finishedProjectsList.addProject.bind(finishedProjectsList))
    finishedProjectsList.setSwitchHandler(activeProjectsList.addProject.bind(activeProjectsList))

    // const someScript = document.createElement('script')
    // // someScript.textContent = 'alert("Hi there!")'
    // document.head.append(someScript)
    // const timerId = setTimeout(this.startAnalytics, 3000)
    // document.getElementById('stop-analytics-btn').addEventListener('click', () => {
    //   clearTimeout(timerId)
    // })
  }

  static startAnalytics () {
    const analyticsScript = document.createElement('script')
    analyticsScript.src = 'assets/scripts/analytics.js'
    analyticsScript.defer = true
    document.head.append(analyticsScript)
  }
}

App.init()
