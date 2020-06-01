class Restaurant extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      theme: 'list'
    };
    this._changeTheme = this._changeTheme.bind(this);
  }

  _handleText(value) {
    this.setState({searchString: value});
  }

  _changeTheme(value) {
    this.setState({theme: value});
  }

  render() {
    const restaurant = window.data.restaurant;

    return <div>
    <h1>{restaurant.name}'a Hoşgeldiniz.</h1>
    <div>
      <h2>
        {restaurant.active_menu.menu_name}
      </h2>
      <div>
        <SearchBox onChange={($event)=>this._handleText($event.target.value)}/>
      </div>
      <div class="center">
        <ThemeButton callback={this._changeTheme}/>
      </div>
      <div>
        <List data={restaurant.active_menu} themeEventListener={this.state.theme} searchEventListener={this.state.searchString}/>
      </div>
    </div>
    </div>
  }
}

class SearchBox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div class="search-container">
      <p class="search-text">Arama Yap</p>
      <input class="search-box" onChange={this.props.onChange} placeholder="Yemek Adına Göre Ara..." />
    </div>
  }
}

class ThemeButton extends React.Component {

  constructor(props) {
    super(props);
  }

  callback(value) {
    this.props.callback(value);
  }

  render() {
    return <div class="theme-button-container">
      <button onClick={()=>this.callback('list')} class="theme-button">List</button>
      <button onClick={()=>this.callback('grid')} class="theme-button">Grid</button>
    </div>
  }
}

class List extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      theme: 'list',
      data: this.props.data,
      filteredData: []
    }
  }

  componentWillReceiveProps() {
    this.themeEventListener(this.props.themeEventListener);
    this.searchEventListener(this.props.searchEventListener);
  }

  themeEventListener(value) {
    this.setState({theme: value});
  }

  searchEventListener(value) {
    console.log('key;:', value);
    let b = this.state.data.menu.items.filter(item => item.item.name.toLowerCase().indexOf(value) > -1);
    const c = [];
    b.forEach(item => c.push(item.id));
    this.setState({filteredData: c});
    this.forceUpdate();
    
  }

  callback(value) {
    this.props.callback(value);
  }

  getItem(data, itemId) {
    return data.menu.items.filter(f => f.id == itemId)[0];
  }
  
  toggleFavorite(itemId) {
    if (this.state.favorites.find(f => f == itemId)) {
      this.state.favorites.forEach((f,index) => {
        if (f == itemId) {
          this.state.favorites.splice(index, 1);
        }
      })
    } else {
      this.state.favorites.push(itemId);
    }
    this.forceUpdate();
  }

  getImageLink(data, item) {
    return this.getItem(data, item).item.images.length > 0 ? this.getItem(data, item).item.images[0]["100"] : null;
  }

  render() {
    const data = this.props.data;
    return <div>
      {data.menu.item_order.map(item_order => 
        <div>
          <div style={{display: 'flex', flexDirection: 'row',alignItems:'center'}}>
            <h3>{item_order.section}</h3>
            <div class="line"></div>
          </div>
          <div style={{clear:'both'}}></div>
            {item_order.items.map(item => 
            <div hidden={this.state.filteredData.length > 0 ? (!this.state.filteredData.find(f=>f==item)) : false} className={this.state.theme == 'list' ? "item-card" : "item-card item-card-grid"}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <img className={this.state.theme == 'list' ? "item-image" : "item-image item-image-grid"} src={this.getImageLink(data, item)}/>
              <div class="item-info">
                <p className={this.state.theme == 'list' ? "item-name" : "item-name item-name-grid"} >{this.getItem(data, item).item.name}</p>
                <div className={this.state.theme == 'list' ? "item-ingredients" : "item-ingredients item-ingredients-grid"} >{this.getItem(data, item).item.ingredients.map(ingredient => <span>{ingredient},</span>)}</div>
                
              </div>
              <div className={this.state.theme == 'list' ? "add-favorite" : "add-favorite add-favorite-grid"} onClick={()=>this.toggleFavorite(this.getItem(data, item).id)}>
                <img src='../images/heart.png' style={this.state.theme == 'list' ? null : {width:15,height:15,marginLeft:20}} />
                <span className={this.state.theme == 'list' ? "favorite-text" : "favorite-text favorite-text-grid"}>
                    {!this.state.favorites.find(f => f == this.getItem(data, item).id) ? 'Favorilere Ekle' : 'Favorilerde!'}
                  </span>
              </div>
              <div className={this.state.theme == 'list' ? 
                this.getItem(data, item).promotion ? "price promotion" : "price" : this.getItem(data, item).promotion ? " price promotion price-grid promotion-grid" : "price price-grid"}>
                <span className={this.getItem(data, item).promotion ? "line-through" : null}>{this.getItem(data, item).item.price}₺</span> <br/>
                {this.getItem(data, item).promotion ? <span style={this.state.theme == 'list' ? {color:'green',textDecoration:'none',fontSize: 35} : {color:'green',textDecoration:'none',fontSize: 20}}>{this.getItem(data, item).promotion}₺</span> : null}
                </div>
            </div>
              <div style={{clear:'both'}}></div>
            </div>)}
        </div>)}
    </div>
  }
}

$(function() {
  ReactDOM.render(
    <Restaurant/>,
    document.getElementById('react-root')
  );

})
