'use client';
import {
    Button,
    Card,
    CardContent,
    FormControl,
    FormControlLabel,
    FormLabel,
    Input,
    Radio,
    RadioGroup
} from '@mui/material';
import {useMemo, useState} from "react";
import moment from "moment";
import "moment/locale/sq";

export default function Home() {
    const [gender, setGender] = useState("male");
    const [birthday, setBirthday] = useState("");
    const [displayResults, setDisplayResults] = useState(false);
    const [finalRetirementYear, setFinalRetirementYear] = useState(0);
    const [finalRetirementMonthIndex, setFinalRetirementMonthIndex] = useState(0);
    const [finalRetirementMonth, setFinalRetirementMonth] = useState('');

    const getFinalRetirementAge = useMemo(() => {
        const retirementFullYear = moment({year: finalRetirementYear, month: finalRetirementMonthIndex});
        const diffMonths = retirementFullYear.diff(moment(birthday), "months");
        const years = Math.floor(diffMonths / 12);
        const months = diffMonths % 12;
        if (years >= 67) {
            return "67 vjec";
        }
        return months === 0 ? years + " vjec" : years + " vjec e " + months + " muaj";
    }, [finalRetirementMonth, finalRetirementYear])

    const onSubmit = () => {
        if (!birthday) {
            return;
        }
        if (gender === 'male') {
            calculateRetirement(65, 0, 1 / 12);
        } else {
            calculateRetirement(60, 2, 2 / 12);
        }
        setDisplayResults(true);
    };

    const calculateRetirement = (defaultRetirementAge = 65, defaultRetirementMonth = 0, retirementAgeIncrease = 1 / 12) => {
        const birthDateObj = new Date(birthday);
        const retirementYear = birthDateObj.getFullYear() + defaultRetirementAge;
        let retirementMonth = birthDateObj.getMonth() + 1;
        let retirementYearIncrease = 0;

        if (retirementYear >= 2033) {
            retirementYearIncrease = (retirementYear - 2033) * retirementAgeIncrease;
            retirementMonth += Math.floor(retirementYearIncrease) * 12;
            const remainingMonths = Math.round((retirementYearIncrease % 1) * 12);
            retirementMonth += remainingMonths;
        }

        setFinalRetirementYear(retirementYear + Math.floor(retirementMonth / 12));
        moment.locale('sq');
        setFinalRetirementMonthIndex(retirementMonth % 12 + defaultRetirementMonth);
        const month = moment().month(retirementMonth % 12 + defaultRetirementMonth).format('MMMM');
        setFinalRetirementMonth(month);
    };

    const calculateOldness = (defaultRetirementAge = 35, defaultRetirementMonth = 4, retirementAgeIncrease = 4 / 12) => {
        const birthDateObj = new Date(birthday);
        const retirementYear = birthDateObj.getFullYear() + defaultRetirementAge;
        let retirementMonth = birthDateObj.getMonth() + 1;
        let retirementYearIncrease = 0;

        if (retirementYear >= 2015) {
            retirementYearIncrease = (retirementYear - 2015) * retirementAgeIncrease;
            retirementMonth += Math.floor(retirementYearIncrease) * 12;
            const remainingMonths = Math.round((retirementYearIncrease % 1) * 12);
            retirementMonth += remainingMonths;
        }

        const yearsOfExperience = retirementYear + Math.floor(retirementMonth / 12) - birthDateObj.getFullYear();
        moment.locale('sq');
        const month = retirementMonth % 12 + defaultRetirementMonth;
        return yearsOfExperience + " vjec e " + month + " muaj";
    };

    return (
        <main className="flex flex-col items-center justify-between p-24">
            <div className="text-2xl text-blue-700 font-bold mb-10">Llogarit moshen e daljes ne pension</div>
            <FormControl>
                <FormLabel className="text-center" id="demo-row-radio-buttons-group-label">Gjinia</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="female" checked={gender === 'female'} control={<Radio/>} label="Femër"
                                      onClick={() => setGender("female")}/>
                    <FormControlLabel value="male" checked={gender === 'male'} control={<Radio/>} label="Mashkull"
                                      onClick={() => setGender("male")}/>
                </RadioGroup>
            </FormControl>
            <div className="my-20">
                <FormControl>
                    <FormLabel className="text-center" id="demo-row-radio-buttons-group-label">Datëlindja</FormLabel>
                    <Input id="date" color="primary" type="date" value={birthday}
                           onChange={(e) => setBirthday(e.target.value)}/>
                </FormControl>
            </div>
            <Button variant="outlined" onClick={onSubmit}>Llogarit</Button>
            {displayResults && (
                <Card className="mt-20 p-5">
                    <div className="flex justify-center text-blue-700 font-semibold">Rezultati</div>
                    <CardContent>
                        <div>Del ne pension ne {finalRetirementMonth} {finalRetirementYear}</div>
                        <div>Mosha e daljes ne pension: {getFinalRetirementAge}</div>
                        <div>Eksperienca e punes: {calculateOldness()}</div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
};
