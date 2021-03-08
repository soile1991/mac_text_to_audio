const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const filenamify = require('filenamify');
var greekUtils = require('greek-utils');


async function ganarateAudio(audioDir, textToSpeak, fileName, femaleSpeaker = true) {
    let speaker = 'Nikos';
    if (femaleSpeaker) {
        speaker = 'Melina';
        fileName += '_female'
    } else {
        fileName += '_male'
    }
    // var { stdout, stderr } = await exec('say -v ' + speaker + ' "' + textToSpeak + '" -o ' + audioDir + '/' + fileName + '.aiff')
    var { stdout, stderr } = await exec('say ' + ' "' + textToSpeak + '" -o ' + audioDir + '/' + fileName + '.aiff')
    if (stderr) {
        console.error(`error: ${stderr}`);
    }
    var {
        stdout,
        stderr
    } = await exec('lame -m m ' + audioDir + '/' + fileName + '.aiff ' + audioDir + '/' + fileName + '.mp3')
    if (stderr) {
        console.error(`error: ${stderr}`);
    }

    var { stdout, stderr } = await exec('rm ' + audioDir + '/' + fileName + '.aiff')
    if (stderr) {
        console.error(`error: ${stderr}`);
    }
}


async function main() {
    const audioListJson = 'audioList.json';

    let rawdata = fs.readFileSync(audioListJson, 'utf8');
    let audioList = JSON.parse(rawdata);

    var audioDir = 'Audio/';

    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir);
    }

    let count = 1;
    for (const audio of audioList) {
        let fileName = filenamify(greekUtils.toGreeklish(audio.replace(/ /g, "_"))).replace(/[!.,]/g, "").toLowerCase();
        await ganarateAudio(audioDir, audio, count + "_" + fileName);
        // await ganarateAudio(audioDir, audio, count + "_" + fileName, false);
        count++;
    }
}

main()