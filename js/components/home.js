export default `
<section class="container search_section">
    <h2>
        Inspírate, busca, guarda, y crea <br & />
        los mejores
        <span class="decorated_text_color">GIFOS</span>
    </h2>
    <div class="search_container">
        <img
            src="../assets/img/ilustra_header.svg"
            alt="search input illustration"
            />
        <div class="prediction_search_container">
            <input
                type="text"
                name="user_prediction"
                id="user_prediction"
                placeholder="Busca GIFOS y más"
                />
            <div id="loader_elements"></div>
            <ul id="predictions_area_section"></ul>
        </div>
    </div>
    <div class="trending_searchs--container">
        <h3>Trending</h3>
        <div id="trending_searchs"></div>
    </div>
    <div class="searched_gifs_section">
        <div id="searched_gifs_section--title"></div>
        <div id="search_area_section"></div>
        <div id="search_area_actions"></div>
    </div>
</section>
<section class="trending_container">
    <div class="container">
        <div class="trending_container--heading">
            <h2>Trending GIFOS</h2>
            <p>Mira los últimos GIFOS de nuestra comunidad.</p>
        </div>
        <div class="trending_slider--container">
            <div
                class="arrow_button arrow_left"
                id="trending_slider--prev_button"
                >
                <span class="material-icons">
                keyboard_arrow_left
                </span>
            </div>
            <div class="trending_slider--container-content">
                <div id="trending_slider--content"></div>
            </div>
            <div
                class="arrow_button arrow_right"
                id="trending_slider--next_button"
                >
                <span class="material-icons">
                keyboard_arrow_right
                </span>
            </div>
        </div>
    </div>
</section>
`;
