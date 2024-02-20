export const helpers = {
    flatMap(arr = [], children, key, value, include = false) {
      return arr.reduce((list, { [children]: items, ...e }) => {
        const found = helpers.findkeyRecursively(items, key, value, include)
        if ((include ? value.includes(e[key]) : value === e[key]) || found)
          list.push(e)
  
        if (items && found) list.push(...helpers.flatMap(items, children, key, value, include))
        return list
      }, [])
    },
  
    findkeyRecursively(obj, key, value, include = false) {
      if (Array.isArray(obj))
        return obj.reduce(function (result, element) {
          if (result === true)
            return true
          return helpers.findkeyRecursively(element, key, value, include)
        }, false)
  
      if (obj !== null && typeof obj === 'object') {
        if (key in obj && (include ? value.includes(obj[key]) || obj[key].includes(value) : obj[key] === value))
          return true
  
        for (let k in obj) {
          if (obj.hasOwnProperty(k) && helpers.findkeyRecursively(obj[k], key, value, include))
            return true
        }
      }
      return false
    },

    getStatusLabel (status) {
      switch (status) {
        case 'INSTOCK':
          return 'success';
    
        case 'LOWSTOCK':
          return 'warning';
    
        case 'OUTOFSTOCK':
          return 'danger';
    
        default:
          return null;
      }
    }
  }