import * as FileStash from '../index';
import * as Tap from 'tap';


const STORE_DIR = 'test_dir/store/';

Tap.plan( 1 );


const expected_path_match = new RegExp([
    STORE_DIR
    ,"/([A-Fa-f0-9]{2})"
    ,"/([A-Fa-f0-9]{2})"
    ,"/\\1\\2[A-Fa-f0-9\\-]+"
].join( "" ) );


Tap.test( 'Make path', async ( test ) => {
    test.plan( 1 );

    const path = await FileStash.makeFilePath( STORE_DIR );
    test.ok( expected_path_match.test( path ),
        "Path in expected place" );
});
