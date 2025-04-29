import { consultarStockProductoDao } from "../StockProductos/stockProductos.dao.js";


export const descontarStockServices = async (stockADescontarData) => {
    try{
        const {stockADescontar} = stockADescontarData;
        
        return Promise.all(
            stockADescontar.map(async (producto) => {
                try{

                    const produtoExist = await consultarStockProductoDao(producto.idProducto, producto.idSucursal);
                    if(produtoExist.idStock !== 0){
                        
                    }
                }catch(error){
                    throw error;
                }
            })

        );

    }catch(error){
        throw error;
    }
}