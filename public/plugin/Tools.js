export function money(number) {
    return Number(number).toLocaleString('es-PE', 
                                { style: 'currency', currency: 'PEN' }
                                );
}

export function uuidv4(){
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    return uuid;   
}