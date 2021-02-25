import { uploadGifo, getGifs } from "./actions.js";
import { gifLayout } from "./layouts.js";

const steps = {
    step_zero: {
        heading: true,
        title: `
            <h2>Aquí podrás <br /> crear tus propios <span class="decorated_text_color">GIFOS</span></h2>
        `,
        description: `
            <p>¡Crea tu GIFO en sólo 3 pasos! <br /> (sólo necesitas una cámara para grabar un video)</p>
        `,
        button: true,
        buttonTitle: "Comenzar",
    },
    step_one: {
        heading: true,
        title: `
            <h2>¿Nos das acceso <br /> a tu cámara?</h2>
        `,
        description: `
            <p>El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.</p>
        `,
        button: false,
        buttonTitle: "",
    },
    step_two: {
        heading: false,
        title: "",
        description: "",
        button: true,
        buttonTitle: "Grabar",
    },
    step_three: {
        heading: false,
        title: "",
        description: "",
        button: true,
        buttonTitle: "Finalizar",
    },
};

function removeAllActiveSteps() {
    const getStepsCircles = document.querySelectorAll(".step_circle");
    for (let i = 0; i < getStepsCircles.length; i++) {
        if (getStepsCircles[i].classList.contains("active")) {
            getStepsCircles[i].classList.remove("active");
        }
    }
}

function stepManager(step, container, button) {
    const getStepCircle = document.getElementById(step);

    if (container) {
        if (steps[step].heading) {
            container.innerHTML = `
                ${steps[step].heading ? steps[step].title : null}
                ${steps[step].heading ? steps[step].description : null}
            `;
        } else {
            container.innerHTML = "";
        }
    }

    if (getStepCircle) {
        removeAllActiveSteps();
        getStepCircle.classList.add("active");
    } else {
        removeAllActiveSteps();
    }

    if (steps[step].video) {
        container.innerHTML = `<video id="video_play_camera"></video>`;
    }

    if (button) {
        if (steps[step].button) {
            button.style.display = "block";
            button.innerHTML = steps[step].buttonTitle;
        } else {
            button.style.display = "none";
        }
    }
}

function pauseVideos() {
    document.querySelectorAll("video").forEach((vid) => vid.pause());
}

function getStream(container, toStep, button) {
    // pauseVideos();
    navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                height: { max: 480 },
            },
        })
        .then(async (stream) => {
            window.streamReference = stream;
            stepManager(toStep, container, button);
            container.innerHTML = "";
            const createVideoElement = document.createElement("video");
            createVideoElement.srcObject = stream;
            createVideoElement.id = "video_preview";
            createVideoElement.play();
            container.appendChild(createVideoElement);
        })
        .catch((err) => {
            alert("Debes permitir la grabación de vídeo en el navegador.");
            stepManager("step_zero", container, button);
        });
}

function stopBrowserRecord() {
    window.streamReference.stop();
}

function loadingProccessGif() {
    const loading = document.createElement("div"); 
    loading.className = "loadingScreen";
    loading.innerHTML = `
        <div class="spiner_loading"></div>
        <p>Estamos subiendo tu gifo</p>
    `;
    return loading;
}


function gifUploadedSuccessfull(gif , container) {
    const getLocalUploads = localStorage.getItem("local-uploads");
    container.innerHTML = "";
    container.appendChild(gifLayout(gif.data , "" , "myGifos" , false , false))

    if (getLocalUploads) {
        const parseUploads = JSON.parse(getLocalUploads);
        if (parseUploads) {
            const newUploads = [gif.data, ...parseUploads];
            localStorage.setItem("local-uploads", JSON.stringify(newUploads));
        } else {
            localStorage.setItem("local-uploads", JSON.stringify([gif.data]));
        }
    } else {
        localStorage.setItem("local-uploads", JSON.stringify([gif.data]));
    }
}

async function uploadGifoFinish(record) {
    const getContainerGifo = document.querySelector(".container_create_gifo");
    const gifoLoading = loadingProccessGif(getContainerGifo);
    getContainerGifo.appendChild(gifoLoading);

    const uploadImage = await uploadGifo(record.blob);
    const gif = await getGifs(`gifs/${uploadImage.data.id}?`);

    getContainerGifo.removeChild(gifoLoading)
    gifUploadedSuccessfull(gif , document.getElementById("gifos_content--content"));
}

function finishRecord(container, record, button, main_container, counter, itemCounter) {
    counter.removeChild(itemCounter);
    const getButtonContainer = document.getElementById("button_element");

    stopBrowserRecord();
    record.stopRecording((gif) => {
        stepManager("step_three", container, button);
        pauseVideos();
        container.innerHTML = "";

        main_container.removeChild(button);

        const createButtonFinish = document.createElement("button");
        createButtonFinish.id = "button_step";
        createButtonFinish.className = "btn_purple";
        createButtonFinish.innerHTML = "Finalizar";

        const createButtonCancel = document.createElement("button");
        createButtonCancel.className = "btn_purple";
        createButtonCancel.innerHTML = "Repetir";

        createButtonFinish.addEventListener("click", () => {
            getButtonContainer.removeChild(createButtonCancel);
            getButtonContainer.removeChild(createButtonFinish);

            uploadGifoFinish(record);
        });

        createButtonCancel.addEventListener("click", (_) => {
            getButtonContainer.removeChild(createButtonCancel);
            getButtonContainer.removeChild(createButtonFinish);

            createFirstStep(container);
        });

        getButtonContainer.appendChild(createButtonFinish);
        getButtonContainer.appendChild(createButtonCancel);

        const createGif = document.createElement("img");
        createGif.src = gif;
        createGif.id = "final_gif_preview_to_upload";
        container.appendChild(createGif);
    });
}

function startCounter(item) {
    let time = {
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

    setInterval((_) => {
        time.seconds++;
        if (time.seconds >= 60) {
            time.seconds = 0;
            time.minutes++;
        }

        if (time.minutes >= 60) {
            time.minutes = 0;
            time.hours++;
        }

        item.innerHTML = time.hours + " : " + time.minutes + " : " + time.seconds;
    }, 1000);
}

function startRecord(container, button) {
    const videoPreview = document.getElementById("video_preview");
    const counter = document.getElementById("couter");
    const getMainCotainer = document.querySelector(".main_container_create_gifo");
    const getButtonContainer = document.getElementById("button_element");
    if (videoPreview) {
        const record = RecordRTC(videoPreview.srcObject, {
            type: "gif",
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
        });
        record.startRecording();

        if (getMainCotainer) {
            getButtonContainer.removeChild(button);

            const counterItem = document.createElement("div");
            counter.appendChild(counterItem);

            if (counter) {
                startCounter(counterItem);
            }

            const createButtonStop = document.createElement("button");
            createButtonStop.id = "button_step";
            createButtonStop.className = "btn_purple";
            createButtonStop.innerHTML = "Parar";

            createButtonStop.addEventListener("click", () => {
                finishRecord(
                    container,
                    record,
                    createButtonStop,
                    getMainCotainer,
                    counter,
                    counterItem
                );
            });

            getMainCotainer.appendChild(createButtonStop);
        }
    }
}

function createFirstStep(getContainer) {
    let actualStep = "step_zero";
    const getButtonContainer = document.getElementById("button_element");

    const getButtonStep = document.createElement("button");
    getButtonStep.id = "button_step";
    getButtonStep.className = "btn_purple";
    getButtonStep.innerHTML = "Comenzar";
    getButtonContainer.appendChild(getButtonStep);

    stepManager(actualStep, getContainer, getButtonStep);

    getButtonStep.addEventListener("click", () => {
        if (actualStep == "step_zero") {
            actualStep = "step_one";
            stepManager(actualStep, getContainer, getButtonStep);
        }

        if (actualStep == "step_two") {
            actualStep = "step_three";
            startRecord(getContainer, getButtonStep);
        }

        if (actualStep == "step_one") {
            setTimeout(() => {
                actualStep = "step_two";
                stepManager(actualStep, getContainer, getButtonStep);
                getStream(getContainer, actualStep, getButtonStep);
            }, 200);
        }
    });
}

(() => {
    const getContainer = document.getElementById("gifos_content--content");

    if (getContainer) {
        createFirstStep(getContainer);
    }
})();
