import { v4 as Uuid } from 'uuid';
import * as FS from 'fs';

const FSPromises = FS.promises;


export type storeFunc = (
    path: string
) => Promise<string>;


export function stash(
    store_dir: string
): storeFunc
{
    return (
        path: string
    ): Promise<string> => {
        const id = Uuid();
        const digits = id.match( /^([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})/ );

        return new Promise( async (resolve, reject) => {
            if( 0 < digits.length ) {
                const first = digits[1];
                const second = digits[2];

                const dst_dir = [
                    store_dir
                    ,first
                    ,second
                ].join( "/" );

                // You shouldn't use exceptions as flow control. Unfortunately,
                // FS.promises didn't get that message.
                try {
                    // If this passes OK, then the directory was already there
                    await FSPromises.access( dst_dir, FS.constants.F_OK );
                }
                catch( err ) {
                    // If we get here, the directory didn't exist, so create it
                    await FSPromises.mkdir( dst_dir, {
                        recursive: true
                    });
                }

                try {
                    const dst_path = dst_dir + `/${id}`;
                    await FSPromises.copyFile( path, dst_path );
                    await FSPromises.unlink( path );
                    resolve( dst_path );
                }
                catch( err ) {
                    reject( err );
                }
            }
            else {
                reject( "Generated UUID did not match regex" );
            }
        });
    };
}

export function makeFilePath(
    store_dir: string
): string
{
    const id = Uuid();
    const digits = id.match( /^([A-Fa-f0-9]{2})([A-Fa-f0-9]{2})/ );

    if( 0 < digits.length ) {
        const first = digits[1];
        const second = digits[2];

        const dst_path = [
            store_dir
            ,first
            ,second
            ,id
        ].join( "/" );
        return dst_path;
    }
    else {
        throw "Generated UUID did not match regex";
    }
}
