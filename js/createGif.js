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

function startRecord(container, button) {
    const videoPreview = document.getElementById("video_preview");
    if (videoPreview) {
        const record = RecordRTC(videoPreview.srcObject, {
            type: "gif",
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: () => {
                console.log("started");
            },
        });
        record.startRecording();
        setTimeout((_) => {
            record.stopRecording((gif) => {
                stepManager("step_three", container, button);
                pauseVideos();
                container.innerHTML = "";
                const createGif = document.createElement("img");
                createGif.src = gif;
                container.appendChild(createGif);
            });
        }, 3000);
    }
}

(() => {
    const getContainer = document.getElementById("gifos_content--content");
    const getButtonStep = document.getElementById("button_step");

    let actualStep = "step_zero";

    stepManager(actualStep, getContainer, getButtonStep);

    getButtonStep.addEventListener("click", () => {
        if (actualStep == "step_zero") {
            actualStep = "step_one";
            stepManager(actualStep, getContainer, getButtonStep);
        }

        if (actualStep == "step_two") {
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
})();
