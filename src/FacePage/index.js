import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';
import Camera from './Camera';
import Canva from './Canva';
import * as faceapi from 'face-api.js';

import icono1 from './buttomicon/ico1.svg';
import icono2 from './buttomicon/ico2.svg';
import icono3 from './buttomicon/ico3.svg';
import icono4 from './buttomicon/ico4.svg';
import icono5 from './buttomicon/ico5.svg';
import icono6 from './buttomicon/ico6.svg';
import icono7 from './buttomicon/ico7.svg';
import icono8 from './buttomicon/ico8.svg';
import icono9 from './buttomicon/ico9.svg';
import icono10 from './buttomicon/ico10.svg';
import icono11 from './buttomicon/ico11.svg';
import icono12 from './buttomicon/ico12.svg';
import icono13 from './buttomicon/ico13.svg';
import icono14 from './buttomicon/ico14.svg';
import icono15 from './buttomicon/ico15.svg';
import './ScrollButton/style.css';

class FacePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            controller: 'game',
            loading: false,
            authorized: false,
            checkAutorization: true,
            positionIndex: 0,
            filterName: 'Musica1',
            imageFilter: new Image(),
            showFilter: true,
            ejeXe: 0,
            ejeYe: 0,
            landStart:0,
            landEnd: 0
        }
        this.setVideoHandler = this.setVideoHandler.bind(this);
        this.isModelLoaded = this.isModelLoaded.bind(this);
    }

    async setVideoHandler() {
        if (this.isModelLoaded() !== undefined) {
            try {
                let result = await faceapi.detectSingleFace(this.props.video.current, this.props.detector_options).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
                if (result !== undefined) {
                    console.log("face detected", 1);
                    const dims = faceapi.matchDimensions(this.props.canvas.current, this.props.video.current, true);
                    const resizedResult = faceapi.resizeResults(result, dims);
                    //faceapi.draw.drawDetections(this.props.canvas.current, resizedResult);
                    //faceapi.draw.drawFaceLandmarks(this.props.canvas.current, resizedResult);

                    const currentCanvas = ReactDOM.findDOMNode(this.props.canvas.current);
                    var canvasElement = currentCanvas.getContext("2d");
                    this.addFilter(canvasElement, result);
                    this.addBoxIndexOfLandmark(canvasElement, result.landmarks.positions[this.state.positionIndex]);
                    this.addBackgroundInformation(canvasElement, result);
                    this.addGenderAndAgeInformation(canvasElement, result);
                    this.addEmotionInformation(canvasElement, resizedResult, result);

                } else {
                    console.log("face detected", 1);
                }
            } catch (exception) {
                console.log(exception);
            }
        }
        setTimeout(() => this.setVideoHandler());
    }

    addBoxIndexOfLandmark(canvasElement, landkmarkPosition) {
        let width = 10, height = 10;
        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
        canvasElement.fillStyle = 'rgb(255, 87, 51)';
        canvasElement.fillRect(landkmarkPosition.x, landkmarkPosition.y, width, height);
        canvasElement.closePath();
        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
    }

    addBackgroundInformation(canvasElement, result) {
        let positionX = result.landmarks.positions[8].x,
            positionY = result.landmarks.positions[8].y + 10;
        canvasElement.fillStyle = "black";
        canvasElement.fillRect(positionX -250, positionY -85, 90, 45);
        //canvasElement.fillRect(positionX - 45, positionY - 12, 90, 45);
    }

    addGenderAndAgeInformation(canvasElement, result) {
        // Edad y Sexo
        canvasElement.font = "10px Comic Sans MS";
        //canvasElement.font="30px Arial";
        canvasElement.fillStyle = "red";
        let positionX = result.landmarks.positions[8].x,
            positionY = result.landmarks.positions[8].y + 10,
            gender = (result.gender) === "male" ? "Hombre" : "Mujer",
            age = "Edad: " + result.age.toFixed();
        gender = "Sexo: " + gender;

        canvasElement.textAlign = "center";
        canvasElement.fillStyle = "white";
        canvasElement.fillText(gender, positionX-200, positionY-70);
        canvasElement.fillText(age, positionX-200, positionY -57);
        
        //canvasElement.fillText(gender, positionX, positionY);
        //canvasElement.fillText(age, positionX, positionY + 15);
    }

    addEmotionInformation(canvasElement, resizedResult, result) {
        const expressions = resizedResult.expressions;
        const maxValue = Math.max(...Object.values(expressions));
        let emotion = Object.keys(expressions).filter(
            item => expressions[item] === maxValue
        );
        emotion = emotion[0];
        emotion = (emotion === "happy") ? "feliz" : emotion;
        emotion = (emotion === "neutral") ? "neutral" : emotion;
        emotion = (emotion === "angry") ? "enojado" : emotion;
        emotion = (emotion === "sad") ? "triste" : emotion;
        emotion = (emotion === "surprised") ? "sorprendido" : emotion;
        emotion = (emotion === "fearful") ? "temeroso" : emotion;

        let positionX = result.landmarks.positions[8].x,
            positionY = result.landmarks.positions[8].y + 10;
            canvasElement.fillText( "Emocion: "+emotion, positionX-200,positionY-45 );
            //canvasElement.fillText("Emocion: " + emotion, positionX, positionY + 30);
    }

    addFilter(canvasElement, result) {
        let startIndex = (this.state.landStart), endIndex = (this.state.landEnd), ajustX = (this.state.ejeXe), ajustY = (this.state.ejeYe);
        let positionX1 = result.landmarks.positions[startIndex].x - ajustX,
            positionY1 = result.landmarks.positions[startIndex].y + ajustY,
            positionX2 = result.landmarks.positions[endIndex].x + ajustX,
            positionY2 = result.landmarks.positions[endIndex].y + ajustY,
            m = ((positionY2 - positionY1) / (positionX2 - positionX1)) * 100;

            
        let width = positionX2 - positionX1,
            height = width * 1;

        positionY1 -= (height / 3);
        positionY2 -= (height / 3);
       // positionX1 -= (width / 2 );
        //positionX2 -= (width / 2 );

        var TO_RADIANS = Math.PI / 180,
            angleInRad = (m / 2.5) * TO_RADIANS;
        console.log("TO_RADIANS", TO_RADIANS);
//console.log(width)
        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
        canvasElement.translate(positionX1, positionY1 - 50);
        canvasElement.rotate(angleInRad);
        canvasElement.drawImage(this.state.imageFilter, 0, 0, width, height);
        /*canvasElement.translate(positionX1 ,positionY1) 
        canvasElement.translate(1,0,0,0,positionX1+(width/2),positionY1); 
        canvasElement.rotate(angleInRad);    */
        //canvasElement.drawImage(this.state.imageFilter,0,0,width,height);
        //canvasElement.restore();
        canvasElement.setTransform(1, 0, 0, 1, 0, 0);
        //this.rotateAndPaintImage(canvasElement, this.state.imageFilter, angleInRad, positionX1, positionY1,20,0 );
    }

    rotateAndPaintImage(context, image, angleInRad, positionX, positionY, axisX, axisY) {
        context.translate(positionX, positionY);
        context.rotate(angleInRad);
        context.drawImage(image, -axisX, -axisY);
        context.rotate(-angleInRad);
        context.translate(-positionX, -positionY);
    }

    isModelLoaded() {
        if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1) return faceapi.nets.ssdMobilenetv1.params;
        if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) return faceapi.nets.tinyFaceDetector.params;
    }


    async componentDidMount() {
        console.log("height: " + window.screen.height + ", width: " + window.screen.width);

        // obtener parametros de configuracion y asignar el modelo que vamos a usar para reconocer rostros
        this.setDetectorOptions();
        this.props.SET_VIDEO_HANDLER_IN_GAME_FACENET(this.setVideoHandler);

        // asignar los archivos del model a face-api
        let modelFolder = "/models";

        let dirs = { 
            Auricular1: '/filter/music6.svg',
            Auricular2: '/filter/music4.svg', 
            Auricular3: '/filter/icox1.svg',
            Auricular4:' /filter/icox2.svg',
            Auricular5: '/filter/icox3.svg',
            Auricular6: '/filter/icox4.svg',
            Auricular7: '/filter/icox11.svg',
            Auricular8: '/filter/auriculares3.svg',
            Auricular9: '/filter/auriculares5.svg',
            Auricular10: '/filter/music8.svg',
            Auricular11: '/filter/auriculares9.svg',
            Auricular12: '/filter/auriculares12.svg',
            Auricular13: '/filter/auriculares2.svg',
            Auricular14: '/filter/icox12.svg',
            Auricular15: '/filter/auriculares4.svg',
        }
        

        let valor = 'auriculares1'
        try {
            await faceapi.loadFaceLandmarkModel(modelFolder);
            await faceapi.nets.ageGenderNet.loadFromUri(modelFolder);
            await faceapi.nets.faceExpressionNet.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1) await faceapi.nets.ssdMobilenetv1.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) await faceapi.nets.tinyFaceDetector.load(modelFolder);

            this.state.imageFilter.src = (dirs[valor]);
            this.state.imageFilter.onload = function () {
                console.log("image is loaded");

            }
        } catch (exception) {
            console.log("exception", exception);
        }
    }


    async componentDidUpdate() {
        console.log('El estado ha cambiado')
        this.props.SET_VIDEO_HANDLER_IN_GAME_FACENET(this.setVideoHandler);

        // asignar los archivos del model a face-api
        let modelFolder = "/models";

        let dirs = { 
        Auricular1: '/filter/music6.svg',
        Auricular2: '/filter/music4.svg', 
        Auricular3: '/filter/icox1.svg',
        Auricular4:' /filter/icox2.svg',
        Auricular5: '/filter/icox3.svg',
        Auricular6: '/filter/icox4.svg',
        Auricular7: '/filter/icox11.svg',
        Auricular8: '/filter/auriculares3.svg',
        Auricular9: '/filter/auriculares5.svg',
        Auricular10: '/filter/music8.svg',
        Auricular11: '/filter/auriculares9.svg',
        Auricular12: '/filter/auriculares12.svg',
        Auricular13: '/filter/auriculares2.svg',
        Auricular14: '/filter/icox12.svg',
        Auricular15: '/filter/auriculares4.svg',
        
     }



        let valor = this.state.filterName
        try {
            await faceapi.loadFaceLandmarkModel(modelFolder);
            await faceapi.nets.ageGenderNet.loadFromUri(modelFolder);
            await faceapi.nets.faceExpressionNet.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.SSD_MOBILENETV1) await faceapi.nets.ssdMobilenetv1.loadFromUri(modelFolder);
            if (this.props.selected_face_detector === this.props.TINY_FACE_DETECTOR) await faceapi.nets.tinyFaceDetector.load(modelFolder);

            this.state.imageFilter.src = (dirs[valor]);
            this.state.imageFilter.onload = function () {
                console.log("image is loaded");

            }
        } catch (exception) {
            console.log("exception", exception);
        }

    }
    setDetectorOptions() {
        let minConfidence = this.props.min_confidence,
            inputSize = this.props.input_size,
            scoreThreshold = this.props.score_threshold;

        // identificar el modelo previsamente entrenado para reconocer rostos.
        // el modelo por defecto es tiny_face_detector
        let options = this.props.selected_face_detector === this.props.SSD_MOBILENETV1
            ? new faceapi.SsdMobilenetv1Options({ minConfidence })
            : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
        this.props.SET_DETECTOR_OPTIONS_IN_GAME_FACENET(options);
    }

  
switchFilter(e){
    
        this.setState({ filterName: e.target.value, ejeX: 0, ejeYe:80 })
       }


    render() {
        return (
            <div>
                <Camera />
                <Canva />

               {/* <input type="number"
                    style={{ marginLeft: 1000 }}
                    value={this.state.positionIndex}
                    onChange={(event) => { this.setState({ positionIndex: event.target.value }) }} />

                */}
                    {/*EL EJEXE SIRVE PARA HACER MAS GRANDE NO PARA MOVER EN HORIZONTAL EN ESTE CODIGO, EL EJEYE ES PARA MOVER HACIA ARRIBA Y ABAJO, EN LANDSTART SE REFIERE AL LANDMARK EN DONDE LA IMAGEN VA INICIAR Y EL LANDEND SE REFIERE A DONDE LA IMAGEN VA TERMINAR */}
                <div className="scroll">
                <button type="button" value='Auricular1' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 38, ejeYe:-30, landStart: 0, landEnd: 16 }) }} ><img src={icono1} width="20" height="20"></img>FILTRO 1</button>
                <button type="button" value='Auricular2' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono2} width="20" height="20"></img>FILTRO 2</button>
                <button type="button" value='Auricular3' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono3} width="20" height="20"></img>FILTRO 3</button>
                <button type="button" value='Auricular4' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono4} width="20" height="20"></img>FILTRO 4</button>
                <button type="button" value='Auricular5' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono5} width="20" height="20"></img>FILTRO 5</button>
                <button type="button" value='Auricular6' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 38, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono6} width="20" height="20"></img>FILTRO 6</button>
                <button type="button" value='Auricular7' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono7} width="20" height="20"></img>FILTRO 7</button>
                <button type="button" value='Auricular8' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 40, ejeYe:  0, landStart: 0, landEnd: 16 }) }}><img src={icono8} width="20" height="20"></img>FILTRO 8</button>
                <button type="button" value='Auricular9' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono9} width="20" height="20"></img>FILTRO 9</button>
                <button type="button" value='Auricular10' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 1, landEnd: 15 }) }}><img src={icono10} width="20" height="20"></img>FILTRO 10</button>
                <button type="button" value='Auricular11' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 1, landEnd: 15 }) }}><img src={icono11} width="20" height="20"></img>FILTRO 11</button>
                <button type="button" value='Auricular12' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 1, landEnd: 15 }) }}><img src={icono12} width="20" height="20"></img>FILTRO 12</button>
                <button type="button" value='Auricular13' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 43, ejeYe:-45, landStart: 0, landEnd: 16 }) }}><img src={icono13} width="20" height="20"></img>FILTRO 13</button>
                <button type="button" value='Auricular14' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono14} width="20" height="20"></img>FILTRO 14</button>
                <button type="button" value='Auricular15' onClick={(event) => { this.setState({ filterName: event.target.value, ejeXe: 35, ejeYe:-30, landStart: 0, landEnd: 16 }) }}><img src={icono15} width="20" height="20"></img>FILTRO 15</button>
                
                </div>
                <h1>{this.state.filterName}</h1>
                
                {/*<h1>{this.state.ejeX}</h1>
                <h1>{this.state.ejey}</h1>*/}
                
            </div>
            
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FacePage);