import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss']
})
export class CanvaComponent implements OnInit,AfterViewInit,OnDestroy {

  constructor() { }

  ngAfterViewInit(): void {
      this.canvas = new fabric.Canvas(
        this.canvasElement.nativeElement,
        {
          width : 900,
          height : 500,
          backgroundColor : '#ffffff',
          selection : true,
          preserveObjectStacking : true}
      )
      this.canvas.on('selection.created',() => {
        this.statusMessage = 'Object updated'
      });

      this.canvas.on('selection.updated',() => {
        this.statusMessage = 'Selection updated'
      });

      this.canvas.on('selection.cleared',() => {
        this.statusMessage = 'No Object selected'

      })
  }



  ngOnInit(): void {
  }

  @ViewChild('canvasElement') canvasElement!:ElementRef<HTMLCanvasElement>

  selectedColor = '#3498db'
  statusMessage = 'Canvas is ready. Add an Object'

  canvas!:fabric.Canvas

  private readonly storageKey = 'fabric-canvas-design'

  

  




  changeColor(event : Event):void{
    const input = event.target as HTMLInputElement
    this.selectedColor = input.value

    const activeObject = this.canvas.getActiveObject();

    if(activeObject){
      activeObject.set('fill',this.selectedColor)
      this.canvas.requestRenderAll()
      this.statusMessage = 'Selected object color update'
    }
  }

  addRectangle(){
    const rectangle = new fabric.Rect({
      left:100,
      top:80,
      width:150,
      height:100,
      fill: this.selectedColor,
      stroke:'#222222',
      strokeWidth:1
    })

    this.canvas.add(rectangle)
    this.canvas.setActiveObject(rectangle)
    this.canvas.requestRenderAll()
    this.statusMessage = 'Rectangle Add'
  }

  addCircle(){
    const circle = new fabric.Circle({
      left:300,
      top:100,
      radius:50,
      fill:this.selectedColor,
      stroke:'#222222',
      strokeWidth:1
    })

    this.canvas.add(circle)
  }

  addText(){
    const text = new fabric.IText('Uday',{
      left:150,
      top:250,
      fontSize:28,
      fill:this.selectedColor
    })

    this.canvas.add(text)
    this.canvas.setActiveObject(text)
    this.canvas.requestRenderAll()
    this.statusMessage = 'Text Add'

  }

  deleteSelected(){
    const activeObjects = this.canvas.getActiveObjects()

    if(activeObjects.length === 0){
      this.statusMessage = 'select Object First'
      return
    }
    activeObjects.forEach(Object => {
      this.canvas.remove(Object)
    })

    this.canvas.discardActiveObject()
    this.canvas.requestRenderAll()
    this.statusMessage = 'select object Delete'
  }
  saveCanvas(){
    const json = JSON.stringify(this.canvas.toJSON())

    localStorage.setItem(this.storageKey,json)

    this.statusMessage = 'Design save'

  }

  loadCanvas(){
    const json = localStorage.getItem(this.storageKey)

    if(!json){
      this.statusMessage = 'No Save';
      console.log(this.statusMessage)
      return
    }

    try{
      this.canvas.loadFromJSON(json,() => {
        this.canvas.requestRenderAll()
        this.statusMessage = 'unable to load the save design'
      })
    }
    catch{
      console.log("Error catch")
    }
  }

  exportPng(){

    const dataUrl = this.canvas.toDataURL({
      format:'png',
      multiplier:1
    })

 
    //console.log(dataUrl);
       const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'canvas-design.png'
    link.click()


  }

  ngOnDestroy(): void {
      if(this.canvas){
        this.canvas.dispose()
      }
  }


}
