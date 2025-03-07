const DEFAULT_OPTIONS = {
  autoClose: 5000,
  position: "top-right",
  onClose : () =>{},
  canClose : true,
  ShowProgress : true,
};


export default class Toast {
  #toastElem;
  #autoCloseinterval;
  #progressInterval;
  #removeBinded 
  #autoClose
  #timeVisible = 0
  #isPaused = false;
  #pause
  #unpause
  #visibiltyChange
  #shouldUnPause
  

  constructor(options) {
    this.#toastElem = document.createElement("div");
    this.#toastElem.classList.add("toast");

    requestAnimationFrame(() =>{
    this.#toastElem.classList.add("show");
    })
        this.#removeBinded = this.remove.bind(this);
        this.#unpause = () => this.#isPaused = false
        this.#pause = () => this.#isPaused = true
        this.#visibiltyChange = () =>{
            this.#shouldUnPause = document.visibilityState === 'visible'
        }
    this.update({ ...DEFAULT_OPTIONS, ...options });

      }
    
  


  set autoClose(value) {
    this.#autoClose = value;
    this.#timeVisible = 0
    if (value === false) return;
    let lastTime 
    const func = (time) => {
        if(this.#shouldUnPause) {
          lastTime = null
          this.#shouldUnPause = false
        }
        if (lastTime == null) {
          lastTime = time
          this.#autoCloseinterval =  requestAnimationFrame(func)
          return
      }
      if(!this.#isPaused){
      this.#timeVisible += time - lastTime
      if(this.#timeVisible >= this.#autoClose) {
        this.remove();
        return;
      } 
    }
    lastTime = time;
        this.#autoCloseinterval = requestAnimationFrame(func); 
    }

      this.#autoCloseinterval = requestAnimationFrame(func);
  }


  set position(value) {
    const selector = `.toast-container[data-position ="${value}"]`;
    const currentContainer = this.#toastElem.parentElement;
    const container =  document.querySelector(selector) || createContainer(value);
    container.append(this.#toastElem);
            if ( currentContainer == null || currentContainer.hasChildNodes()) return 
                    currentContainer.remove()
            
  }


  set text(value) {
    this.#toastElem.textContent = value;
  }


  set canClose(value){   
    this.#toastElem.classList.toggle("can-close" , value) 
    if(value){
    this.#toastElem.addEventListener("click" , this.#removeBinded )
    }
    else{
    this.#toastElem.removeEventListener("click", this.#removeBinded);

    }
  }
  set ShowProgress(value){
      this.#toastElem.classList.toggle("progress" , value)
      this.#toastElem.style.setProperty("--progress" , value)

      if (value) {
    
      
      const func = () =>{

        if (!this.#isPaused) {
          this.#toastElem.style.setProperty("--progress" , 1- this.#timeVisible / this.#autoClose)
        }

        this.#progressInterval =  requestAnimationFrame(func)

      }


        this.#progressInterval =  requestAnimationFrame(func)
             
    }
      }

  
  
set pauseOnHover(value) {
  this.#toastElem.classList.toggle("can-close" , value) 
  if(value){
  this.#toastElem.addEventListener("mouseover" , this.#pause )
  this.#toastElem.addEventListener("mouseleave" , this.#unpause )
  }
  else{
    this.#toastElem.removeEventListener("mouseover" , this.#pause )
    this.#toastElem.removeEventListener("mouseleave" , this.#unpause )

  }
}

set PauseOnFocusLoss(value) {
  // this.#toastElem.classList.toggle("can-close" , value)
  if(value){
  document.addEventListener("visibilitychange" , this.#visibiltyChange )
  }
  else{
    document.removeEventListener("visibilitychange" , this.#visibiltyChange )
  }
}

  update(options) {
            Object.entries(options).forEach(([key , value]) =>{
                this[key] = value
            })

        }

  remove() {
    cancelAnimationFrame(this.#autoCloseinterval)
    cancelAnimationFrame(this.#progressInterval)
    const container = this.#toastElem.parentElement;
    this.#toastElem.classList.remove("show")
    this.#toastElem.addEventListener("transitionend" , ()=>{
      this.#toastElem.remove();
      if(container.hasChildNodes()) return
      container.remove();
    })
    this.onClose()
  }
}

function createContainer(position) {
  const container = document.createElement("div");
  container.classList.add("toast-container");
  container.dataset.position = position;
  document.body.append(container);
  return container;
}
