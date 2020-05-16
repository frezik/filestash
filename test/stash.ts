import * as FileStash from '../index';
import * as FS from 'fs';
import * as Tap from 'tap';

const STORE_DIR = 'test_dir/store/';
const TMP_DIR = 'test_dir/tmp/';
const FSPromises = FS.promises;

Tap.plan( 1 );


Tap.test( 'File Store', ( test ) => {
    test.plan( 3 );

    const store = FileStash.stash( STORE_DIR );
    const start_file_path = TMP_DIR + "/foo.txt";

    const expected_path_match = new RegExp([
        STORE_DIR
        ,"/([A-Fa-f0-9]{2})"
        ,"/([A-Fa-f0-9]{2})"
        ,"/\\1\\2[A-Fa-f0-9\\-]+"
    ].join( "" ) );

    test.comment( `Writing to ${start_file_path}` );
    FSPromises.writeFile( start_file_path, "bar baz" ).then( () => {
        return store( start_file_path );
    }).then( (file_path) => {
        test.comment( `Stored file at ${file_path}` );
        test.ok( expected_path_match.test( file_path ),
            "Stored in expected place" );

        FSPromises.access( file_path, FS.constants.F_OK ).then( async () => {
            test.pass( "File was stored" );
            // Cleanup
            await FSPromises.unlink( file_path );
        }).catch( () => test.fail( "File was not stored" ) );
    }).then( () => {
        FSPromises.access( start_file_path, FS.constants.F_OK )
            .then( async () => {
                test.fail( "Old file was not removed" );
                // Cleanup the file that wasn't supposed to be there
                await FSPromises.unlink( start_file_path );
            }).catch( () => test.pass( "Old file was removed" ) );
    }).catch( ( err ) => {
        test.fail( "Error: " + err );
    });
});
