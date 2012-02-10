from optparse import OptionParser
import sys

def printArgs(lat,lon):
  print "Lat %s" % str(lat)
  print "Lon %s" % str(lon)


def main():

  parser = OptionParser()

  parser.add_option("-l", "--lat", default=None, action="store",

      help="parameter filename")

  parser.add_option("-n", "--lon", default=None, action="store",

      help="parameter filename")

  opts, args = parser.parse_args()

  printArgs(opts.lat,opts.lon)


if __name__ == "__main__":

  try:

    sys.exit(main())

  except SystemExit:

    raise

  except KeyboardInterrupt:

    sys.exit(1)

